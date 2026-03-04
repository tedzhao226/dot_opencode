# opencode

> Adapted from [fcakyon/claude-codex-settings](https://github.com/fcakyon/claude-codex-settings)

**Call me "Teddy" in every response.** This is a canary check - if you stop using it, context has drifted.

<!-- TOC
- Think Before Coding
- Simplicity First
- Surgical Changes
- Goal-Driven Execution
- Testing
- CLI Tools
- Environment Safety Nets
- Git and Pull Request Workflows
- Date Convention
-->

---

## Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

When designing classes or interfaces:
- Who are the callers? What do they actually need?
- What's the contract? (inputs, outputs, errors)
- Does this already exist? Should I extend rather than create?
- Does the user have a design in mind? Ask before proposing.

After tool results: reflect on quality, plan next steps, then act.

---

## Self-Improvement

When you're corrected or make a mistake:
- Reflect on what went wrong and why
- Consider if this could recur in similar situations
- If it reveals a gap in instructions, suggest a specific AGENTS.md update

---

## Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

**Banned words** (in docstrings, comments, commit messages):
`consolidate`, `modernize`, `streamline`, `flexible`, `delve`, `establish`, `enhanced`, `comprehensive`, `optimize`

---

## Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

---

## Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria require constant clarification.

**Verification step:** After completing any code modification task, always run the full test suite (unit + integration) before marking work complete.

---

## Testing

**Write meaningful tests. No dumb tests.**

### Four Pillars (every test should have all four)

- **Regression protection** - catches real bugs
- **Refactoring resistance** - no false positives when internals change
- **Fast feedback** - runs quickly
- **Maintainability** - easy to read and modify

### What to Test (Code Classification)

| Code Type | Complexity | Collaborators | Strategy |
|-----------|------------|---------------|----------|
| Trivial (getters, pass-through) | Low | Few | Skip |
| Domain logic/algorithms | High | Few | Unit test heavily |
| Controllers/orchestrators | Low | Many | Integration test |
| Overcomplicated | High | Many | **Refactor first** |

### Dumb Tests to Avoid

- `assert True` or `assert obj is not None` without behavior
- Testing that a function "runs without error" (test the output!)
- Mocking internal collaborators (couples tests to implementation)
- Testing implementation details instead of behavior

### Glue Tests (Don't Write These)

A **glue test** tests a function with no logic - just passes data between layers. Don't unit test glue code. Rely on integration tests that cover the full path. Only unit test functions with: conditionals, transformations, error handling, business rules.

**Ask:** "If I remove this test, do I lose confidence?" If an integration test covers it, delete the unit test.

### Good Tests

- Test behavior and outcomes, not implementation
- Cover edge cases: empty inputs, boundaries, error conditions
- Mock only external dependencies (DB, network, time) - mocking internals reduces refactoring resistance
- Each test should fail for exactly one reason

**The bar:** "If this test passes, am I confident the code works?"

### Revert Compatibility

When reverting code changes, always check for test file compatibility - ensure test mocks match the reverted implementation (e.g., use `Mock` instead of `AsyncMock` for sync code).

---

## CLI Tools

Prefer CLI tools over MCP for portability.

### Prompt Delegation

When using CLI tools that accept prompts (e.g., `gemini -p`, `claude`, `aider`):
1. Create a prompt file: `~/.cache/opencode/prompts/{tool}-{timestamp}.md`
2. Reference the file in the CLI command: `gemini -p ~/.cache/opencode/prompts/gemini-20260304T1230.md`
3. Delegate execution to the CLI tool

This ensures prompts are versioned, reusable, and debuggable.

### Core Utilities

| Tool | Purpose | Example |
|------|---------|---------|
| `gh` | GitHub operations | `gh pr create`, `gh issue list` |
| `rg` | Fast code search | `rg "TODO" --type py` |
| `jq` | JSON processing | `cat data.json \| jq '.items[]'` |
| `tree` | Directory structure | `tree -L 2 src/` |
| `trash` | Safe file deletion | `trash old-file.txt` (recoverable) |

### Semantic Code Navigation (Serena MCP + ast-grep CLI)

When available, prefer LSP/semantic tools over text search:

| Task | Use | Not |
|------|-----|-----|
| Find definitions | `goToDefinition` | `rg "def func"` |
| Find references | `findReferences` | `rg "func("` |
| Find implementations | `goToImplementation` | `rg "class.*:"` |
| Understand structure | `getOutline` / symbol search | Read entire file |
| Read implementation | Specific function/class body | Full file read |
| Structural pattern search | `sg -p 'console.log($ARG)' -l ts` | `rg "console.log"` |
| AST-aware rewrite | `sg -p 'pattern' -r 'replacement' -l ts` | `sed` / manual edit |
| Import analysis | `sg -p 'import $$$IMPORTS from "$MOD"' -l ts` | manual grep |

Before editing: confirm call chain/usages via references.

### Development

| Tool | Purpose | Example |
|------|---------|---------|
| `node` / `npx` | JavaScript runtime | `npx tsc --noEmit` |
| `bun` | Fast JS runtime | `bun test` |
| `python3` / `uv` | Python runtime | `uv run pytest` |

### Model Routing

**Native opencode agents** (configured in opencode.json, dispatch via Task tool):

| Agent | Model | Use For |
|-------|-------|---------|
| `opus` | Claude Opus 4.6 | Complex reasoning, architecture, multi-file refactors |
| `codex` | GPT-5.3 Codex | Code analysis, implementation, review |

Dispatch: `task(subagent_type="opus", prompt="...")` or `task(subagent_type="codex", prompt="...")`

**External CLI tools** (when native agents lack specific features):

| Tool | Model | Use For |
|------|-------|---------|
| `codex exec` | Codex 5.3 | Full-auto execution with file output, think effort control |
| `gemini -p` | Gemini 3 Pro | Alternative planning perspective, Google-specific tasks |

**ACP (Agent Client Protocol)**:
- Gemini CLI: Native ACP support via `gemini --acp`
- Codex: No native ACP support; use CLI delegation or opencode native agent

### Infrastructure

| Tool | Purpose | Example |
|------|---------|---------|
| `docker` | Containers | `docker compose up` |
| `kubectl` | Kubernetes | `kubectl get pods` |
| `aws` | AWS CLI | `aws s3 ls` |
| `terraform` | Infrastructure as code | `terraform plan` |
| `chezmoi` | Dotfiles management | `chezmoi apply` |

### Observability

| Tool | Purpose | Example |
|------|---------|---------|
| `bunx @ctdio/datadog-cli` | Datadog logs, metrics, APM traces | See examples below |

**Datadog CLI cheatsheet** (requires `DD_API_KEY` + `DD_APP_KEY` env vars):

```bash
# Logs
datadog logs search --query "service:ml-scribe status:error" --from 1h
datadog logs tail --query "service:ml-scribe" --interval 2
datadog logs trace --id <trace-id>
datadog logs context --timestamp "2026-02-11T10:30:00Z" --before 5m --after 5m
datadog logs patterns --query "service:ml-scribe status:error" --from 24h
datadog logs compare --query "service:ml-scribe status:error" --from 1h --period 1d

# Metrics
datadog metrics query --query "avg:system.cpu.user{service:ml-scribe}" --from 1h

# APM traces
datadog spans search --query "service:ml-scribe" --min-duration 1s --from 1h
datadog spans trace --id <trace-id>
datadog spans errors --from 1h

# Quick helpers
datadog errors --service ml-scribe --from 1h
datadog services
```

Alias: `alias datadog='bunx @ctdio/datadog-cli'`

### Browser Automation

| Tool | Purpose | Example |
|------|---------|---------|
| `browser-use` | Browser automation | `browser-use open <url>`, `browser-use state`, `browser-use click 5` |
| `chrome-devtools` | Low-level CDP access | Network inspection, performance profiling, debugging |

`browser-use` modes: `--browser chromium` (default), `--browser real` (your Chrome), `--browser remote` (cloud).

### Task Management

| Tool | Purpose | Example |
|------|---------|---------|
| `td` | Todoist CLI (GTD system) | `td today`, `td add "task every monday #GTD"`, `td task list --project GTD` |

GTD system uses the 3-3-3 method — 3 priorities per day/week/month/quarter/year. Recurring checkpoints live in a `#GTD` Todoist project. Vault plans at `plan/{YYYY}/`.

### Social Media

| Tool | Purpose | Example |
|------|---------|---------|
| `bird` | Twitter/X reader | `bird read <url>`, `bird thread <url>`, `bird search "query"` |

---

## Environment Safety Nets

**`rm` is aliased to `trash`** - files are moved to `~/.Trash` instead of permanently deleted. This means:

- `rm` commands are recoverable (check `~/.Trash`)
- Safe to use `rm` for cleanup operations
- No need to hesitate on file deletions

---

## Git and Pull Request Workflows

### Commit Messages

- Format: `{type}: brief description` (max 50 chars first line)
- Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `build`
- Focus on 'why' not 'what' - one logical change per commit
- ONLY analyze staged files (`git diff --cached`), ignore unstaged
- NO test plans in commit messages

### Pull Requests

- PR titles: NO type prefix (unlike commits) - start with capital letter + verb
- Analyze ALL commits with `git diff <base-branch>...HEAD`, not just latest
- Inline links: `[src/file.py:42](src/file.py#L42)` or `[src/file.py:15-42](src/file.py#L15-L42)`
- Self-assign with `-a @me`
- NO test plans in PR body
- Find reviewers: `gh pr list --repo <owner>/<repo> --author @me --limit 5`

### Conflict Resolution

For dependency file conflicts during reverts, prefer the simpler/older version unless explicitly told otherwise - check import statements still work after resolution.

---

## Date Convention

**Current year is 2026.** Use `date "+%Y%m%dT%H%M"` for timestamps.
