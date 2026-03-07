# opencode Configuration

Setup and configuration for opencode CLI agent.

---

## Setup Log

**Date:** 2026-03-04

### Initial Setup

Adapted configuration from Claude Code (`.claude/CLAUDE.md`) for opencode.

### Key Changes

1. **Removed Dual-Mode Architecture section** - Not applicable to opencode
2. **Kept "Call me Teddy" canary check** - Important context verification
3. **Replaced "Claude Code" → "opencode"** throughout documentation
4. **Replaced "CLAUDE.md" → "AGENTS.md"** for self-references

### Skills Installed

**Superpowers (14 skills):**
- brainstorming
- dispatching-parallel-agents
- executing-plans
- finishing-a-development-branch
- receiving-code-review
- requesting-code-review
- subagent-driven-development
- systematic-debugging
- test-driven-development
- using-git-worktrees
- using-superpowers
- verification-before-completion
- writing-plans
- writing-skills

**High-Value Local Skills (9 skills):**
- testing
- zettelkasten-note
- issue-driven-development
- browser-use
- opensrc
- chezmoi
- gog
- skill-installer
- reflect

**Total: 23 skills**

### MCP Servers Configured

- **serena** - Semantic code navigation (LSP-based goto definition, references)
- **chrome-devtools** - Browser debugging, network inspection, performance profiling
- **context7** - Library documentation lookup
- **mcp-docker** - Docker gateway

### Files Created

- `~/.config/opencode/AGENTS.md` - opencode rules and guidelines
- `~/.config/opencode/README.md` - This changelog
- `~/.config/opencode/skills/` - Skill directory (23 skills)

### Installation Commands Used

```bash
# Install superpowers skills globally
npx skills add vercel-labs/agent-skills --skill '*' -g -a opencode -y
```

### Notes

- All skills installed globally to `~/.config/opencode/skills/`
- Skills adapted from Claude Code where needed
- MCP servers configured in `opencode.json`
- Use `opencode mcp list` to verify MCP servers

---

## 2026-03-08 — Config Sync from Claude

Adapted recent Claude Code configuration changes for OpenCode.

### Added

- **docs/** directory (7 files): agents.md, task-routing.md, skills.md, behaviors-extended.md, behaviors-reference.md, content-safety.md, scaffolding-checkpoint.md
- **agents/** directory (3 files): performance-analyzer.md, pr-reviewer.md, security-reviewer.md
- **AGENTS.md**: On-demand loading index, Skill Security Audit section, Quality Control core triggers
- **opencode.json**: `rrm` deny rule, `gh repo delete` ask rule
- **skills/rtk** symlink

### Not Ported (Claude-specific)

- memory/, hooks/, planning/, plugins/, commands/
- SSOT ownership tables (Claude memory system)
- RTK hook-based rewriting (Claude hooks feature)
- Session-end/memory-flush triggers (no hook support in OpenCode)
- URL Fetch Routing (Claude-specific tool mapping)

---

*Last updated: 2026-03-08*
