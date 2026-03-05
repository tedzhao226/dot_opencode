// Confirmo OpenCode Plugin
// This plugin is installed to ~/.config/opencode/plugin/ to track OpenCode status

import type { Plugin } from '@opencode-ai/plugin'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

const STATUS_DIR = path.join(os.homedir(), '.confirmo', 'opencode-status')
const STATUS_FILE = path.join(STATUS_DIR, 'status.json')
const SESSIONS_DIR = path.join(STATUS_DIR, 'sessions')

// Ensure directories exist
function ensureDirs(): void {
  if (!fs.existsSync(STATUS_DIR)) {
    fs.mkdirSync(STATUS_DIR, { recursive: true })
  }
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true })
  }
}

// Atomic write using temp file + rename
function writeStatusAtomic(filePath: string, data: unknown): void {
  const tempPath = filePath + '.tmp.' + process.pid
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2))
    fs.renameSync(tempPath, filePath)
  } catch (e) {
    // Clean up temp file on failure
    try {
      fs.unlinkSync(tempPath)
    } catch (_) {}
    throw e
  }
}

interface SessionData {
  sessionId: string
  status: 'idle' | 'working' | 'completed' | 'error'
  workingDirectory?: string
  sessionTitle?: string
  needsAttention?: string | null
  lastEvent: {
    type: string
    timestamp: number
    details?: string
  }
  startedAt: number
  endedAt?: number
  lastUpdated?: number
}

interface StatusFile {
  version: number
  lastUpdated: number
  sessions: { [id: string]: SessionData }
}

// Read current status or create empty
function readStatus(): StatusFile {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'))
    }
  } catch (e) {
    // Ignore parse errors
  }
  return { version: 1, lastUpdated: Date.now(), sessions: {} }
}

// Update session status
function updateSession(sessionId: string, updates: Partial<SessionData>): void {
  ensureDirs()

  // Update per-session file
  const sessionFile = path.join(SESSIONS_DIR, sessionId.replace(/[/\\:]/g, '_') + '.json')
  let session: SessionData = {
    sessionId,
    status: 'idle',
    startedAt: Date.now(),
    lastEvent: { type: 'init', timestamp: Date.now() }
  }
  try {
    if (fs.existsSync(sessionFile)) {
      session = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'))
    }
  } catch (e) {
    // Ignore parse errors
  }

  Object.assign(session, updates, { lastUpdated: Date.now() })
  writeStatusAtomic(sessionFile, session)

  // Update main status file
  const status = readStatus()
  status.sessions[sessionId] = session
  status.lastUpdated = Date.now()

  // Clean up old sessions (older than 24h)
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  for (const [id, sess] of Object.entries(status.sessions)) {
    if (sess.endedAt && sess.endedAt < cutoff) {
      delete status.sessions[id]
      try {
        fs.unlinkSync(path.join(SESSIONS_DIR, id.replace(/[/\\:]/g, '_') + '.json'))
      } catch (e) {
        // Ignore
      }
    }
  }

  writeStatusAtomic(STATUS_FILE, status)
}

// Extract tool details from input
function extractToolDetails(toolName: string, input: Record<string, unknown>): string {
  let details = toolName

  if (input.filePath && typeof input.filePath === 'string') {
    details = `${toolName}: ${path.basename(input.filePath)}`
  } else if (input.file_path && typeof input.file_path === 'string') {
    details = `${toolName}: ${path.basename(input.file_path)}`
  } else if (input.pattern && typeof input.pattern === 'string') {
    details = `${toolName}: ${(input.pattern as string).slice(0, 40)}`
  } else if (input.command && typeof input.command === 'string') {
    details = `${toolName}: ${(input.command as string).slice(0, 40)}`
  } else if (input.query && typeof input.query === 'string') {
    details = `${toolName}: ${(input.query as string).slice(0, 40)}`
  } else if (input.url && typeof input.url === 'string') {
    details = `${toolName}: ${(input.url as string).slice(0, 40)}`
  }

  return details
}

// OpenCode event structure (from SDK types + debug observation):
//   session.created/deleted/updated: event.properties.info (Session object with id, title, etc.)
//   session.idle: event.properties.sessionID
//   session.error: event.properties.sessionID, event.properties.error
//   session.status: event.properties.sessionID, event.properties.status.type ("busy"|"idle")
//   message.updated: event.properties.info (Message with sessionID, role, finish, summary, etc.)
//   message.part.updated: event.properties.sessionID, event.properties.part
//   tool.execute.before: (input: {tool, sessionID, callID}, output: {args})
//   tool.execute.after: (input: {tool, sessionID, callID}, output: {title, output, metadata})
export const ConfirmoPlugin: Plugin = async ({ directory }) => {
  // Track session titles per session
  const sessionTitles = new Map<string, string>()

  return {
    event: async ({ event }) => {
      const now = Date.now()
      const props = (event as any).properties || {}

      // === Status-changing events ===
      // These are the ONLY events that should change session status.
      // This prevents late metadata updates from overriding completion.

      // session.status is the authoritative status signal from OpenCode
      if (event.type === 'session.status') {
        const sessionId = props.sessionID || 'unknown'
        const statusType = props.status?.type

        if (statusType === 'busy') {
          // Only set status to working; don't overwrite lastEvent
          // because tool hooks provide more detailed lastEvent info
          updateSession(sessionId, {
            status: 'working',
            workingDirectory: directory
          })
        } else if (statusType === 'idle') {
          updateSession(sessionId, {
            status: 'completed',
            lastEvent: { type: 'session_status_idle', timestamp: now }
          })
        }
        return
      }

      if (event.type === 'session.idle') {
        const sessionId = props.sessionID || props.info?.id || 'unknown'
        updateSession(sessionId, {
          status: 'completed',
          lastEvent: { type: 'session_idle', timestamp: now }
        })
        return
      }

      if (event.type === 'session.error') {
        const sessionId = props.sessionID || props.info?.id || 'unknown'
        const error = props.error || 'Unknown error'
        updateSession(sessionId, {
          status: 'error',
          lastEvent: {
            type: 'session_error',
            timestamp: now,
            details: typeof error === 'string' ? error.slice(0, 100) : 'Error occurred'
          }
        })
        return
      }

      // === Metadata-only events ===
      // These update titles, details, etc. but NEVER change status.

      if (event.type === 'session.created') {
        const info = props.info || {}
        const sessionId = info.id || props.sessionID || 'unknown'
        const title = info.title
        if (title) {
          sessionTitles.set(sessionId, title)
        }
        updateSession(sessionId, {
          status: 'idle',
          workingDirectory: directory,
          sessionTitle: title,
          startedAt: now,
          lastEvent: { type: 'session_created', timestamp: now }
        })
        return
      }

      if (event.type === 'session.updated') {
        const info = props.info || {}
        const sessionId = info.id || props.sessionID || 'unknown'
        const title = info.title
        if (title) {
          sessionTitles.set(sessionId, title)
          updateSession(sessionId, { sessionTitle: title })
        }
        return
      }

      if (event.type === 'session.deleted') {
        const info = props.info || {}
        const sessionId = info.id || props.sessionID || 'unknown'
        updateSession(sessionId, {
          status: 'idle',
          endedAt: now,
          lastEvent: { type: 'session_deleted', timestamp: now }
        })
        return
      }

      // message.updated: update details and title, but NOT status
      if (event.type === 'message.updated') {
        const info = props.info || {}
        const sessionId = info.sessionID || props.sessionID || 'unknown'
        const role = info.role

        if (role === 'user') {
          // Extract title from user message summary
          let title = sessionTitles.get(sessionId)
          if (!title && info.summary?.title) {
            title = info.summary.title
            sessionTitles.set(sessionId, title)
          }
          // Only update title/details metadata, not status
          // (session.status "busy" handles the working state)
          if (title) {
            updateSession(sessionId, {
              workingDirectory: directory,
              sessionTitle: title
            })
          }
        }
        // Don't handle assistant messages here - tool hooks provide better details
        return
      }

      // message.part.updated: update tool details only
      if (event.type === 'message.part.updated') {
        const sessionId = props.sessionID || props.part?.sessionID || 'unknown'
        const part = props.part || {}

        if (part.type === 'tool') {
          const toolName = part.tool || 'Unknown tool'
          const input = part.state?.input || {}
          const details = extractToolDetails(toolName, input)
          updateSession(sessionId, {
            lastEvent: { type: 'tool_use', timestamp: now, details }
          })
        }
        return
      }
    },

    // Hook into tool execution for more detailed tracking
    // Hooks receive (input, output) as two parameters
    'tool.execute.before': async (input: any, output: any) => {
      const sessionId = input.sessionID || 'unknown'
      const toolName = input.tool || 'Unknown tool'
      const toolArgs = output?.args || {}
      const now = Date.now()

      // Check for attention-requiring tools
      const attentionTools = ['ask', 'confirm', 'mcp__conductor__AskUserQuestion']
      const needsAttention = attentionTools.includes(toolName)

      const details = extractToolDetails(toolName, toolArgs)
      updateSession(sessionId, {
        needsAttention: needsAttention ? toolName : null,
        lastEvent: { type: 'tool_execute_before', timestamp: now, details }
      })
    },

    'tool.execute.after': async (input: any, output: any) => {
      const sessionId = input.sessionID || 'unknown'
      const toolName = input.tool || 'Unknown tool'
      const now = Date.now()

      // Include tool name in the details so the UI can show what just completed
      const title = output?.title
      const details = title ? `${toolName}: ${title.slice(0, 50)}` : toolName
      updateSession(sessionId, {
        needsAttention: null, // Clear attention state
        lastEvent: { type: 'tool_execute_after', timestamp: now, details }
      })
    }
  }
}

export default ConfirmoPlugin
