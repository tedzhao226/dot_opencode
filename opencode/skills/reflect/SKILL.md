---
name: reflect
description: Review the current conversation to extract learnings, errors, and improvement opportunities. Use when user says "reflect", "what did we learn", "session review", "review this conversation", or "extract learnings".
---

# Reflect

Review the current conversation for learnings, errors, and skill/memory opportunities.

Source: https://x.com/DellAnnaLuca/status/2022698642403143984

## Workflow

### Step 1: Scan Conversation

Review the full conversation and categorize events:

| Category | What to look for |
|----------|-----------------|
| Errors | Failed commands, wrong assumptions, retries |
| Corrections | User corrections, changed approach mid-task |
| Discoveries | Non-obvious findings, workarounds, gotchas |
| Patterns | Repeated actions that could be automated |
| Decisions | Architecture or design choices with rationale |

### Step 2: Extract

For each finding, determine the best action:

| Finding type | Action |
|-------------|--------|
| Reusable workflow | Create a new skill (use skill-creator guide) |
| Project fact | Write to Serena memory |
| Past-conversation recall | Save via episodic-memory |
| Existing skill gap | Suggest improvement to existing skill |
| AGENTS.md gap | Suggest instruction update |

### Step 3: Present

Show findings as a numbered list with proposed actions. Example:

```
1. [Error] Assumed async API but it was sync → Add note to project memory
2. [Pattern] Ran same 3-command sequence 4 times → Candidate for new skill
3. [Decision] Chose SQLite over Postgres for local dev → Write to memory
```

### Step 4: Act

Use `AskUserQuestion` to ask which findings to implement. Execute approved actions using the appropriate tool (skill creation, memory write, AGENTS.md edit).

