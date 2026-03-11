# Coding

## Approach

Don't assume. Don't hide confusion. Surface tradeoffs.

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- After tool results: reflect on quality, plan next steps, then act.
- When corrected: reflect on what went wrong, consider if it could recur, suggest an AGENTS.md update if systemic.

When designing classes or interfaces:
- Who are the callers? What do they actually need?
- What's the contract? (inputs, outputs, errors)
- Does this already exist? Should I extend rather than create?
- Does the user have a design in mind? Ask before proposing.

**Banned words** (in docstrings, comments, commit messages):
`consolidate`, `modernize`, `streamline`, `flexible`, `delve`, `establish`, `enhanced`, `comprehensive`, `optimize`

## Build

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Surgical changes — touch only what you must:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused.
- Every changed line should trace directly to the user's request.

## Tests

Use the testing skill for test strategy and patterns.

## Verify

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

After completing any code modification, run the full test suite (unit + integration) before marking work complete.

Strong success criteria let you loop independently. Weak criteria require constant clarification.

# File Rules

When editing these file types, read the matching rule file first:

- Python (`.py`): `rules/python.md`
- Dockerfile: `rules/docker.md`
- Docker Compose: `rules/docker-compose.md`
- Makefile: `rules/makefile.md`
- Markdown (`.md`): `rules/markdown.md`
- `.env`: `rules/env.md`
- FastAPI: `rules/fastapi.md`
