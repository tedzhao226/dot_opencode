---
name: issue-driven-development
description: >
  Context persistence for the dev cycle. Use when: starting a feature branch, resuming work,
  saving progress, ending a session, handing off to another agent, or losing context.
  Triggers include "checkpoint", "save progress", "where was I", "resume work", "pick up where
  I left off", "what's the status", "session ending", "hand off", "context", "dev status",
  "update issue", "branch status", "what did I do", "catch me up".
---

# Issue-Driven Development

`git commit` saves code. **Context checkpoints** save session state — to a GitHub issue, not the repo.

## The Model

```
git commit   →  saves CODE to the repo
checkpoint   →  saves CONTEXT to the issue
```

Don't commit progress notes, TODOs, or decision logs as files. GitHub issues are free, persistent, and don't pollute the codebase.

## Branch → Issue Linking

Branch names carry the ticket prefix:

```
feat/MOD-632-template-example-generation
      ^^^^^^ ticket code
```

```bash
gh issue list --repo OWNER/REPO --search "MOD-632"
```

## Checkpoint: One Living Comment

Maintain **one comment** on the issue. Edit it on each checkpoint — don't append new comments.

### Template

Use this structure. Agents can parse it; humans can scan it.

```markdown
## Status: [in-progress | blocked | ready-for-review]

**Branch:** `feat/MOD-632-template-example-generation`
**Latest commit:** `abc1234` — brief message
**Plan:** [link to plan file or inline summary]

### Built
- [x] Module A — what it does
- [x] Module B — what it does

### Not Wired Yet
- [ ] Module C — what's missing and why

### TODOs
- [ ] Actionable item (enough detail for cold start)
- [ ] Another item

### Decisions
- **Chose X over Y** — reasoning so it's not re-debated
```

### gh CLI Commands

```bash
# Find the living comment
gh api repos/OWNER/REPO/issues/NUMBER/comments \
  --jq '.[] | {id, preview: (.body[:60])}'

# Update it (PATCH, not POST)
gh api repos/OWNER/REPO/issues/comments/COMMENT_ID \
  -X PATCH -f body="$(cat <<'EOF'
... checkpoint content ...
EOF
)"

# Delete an accidental orphan
gh api repos/OWNER/REPO/issues/comments/COMMENT_ID -X DELETE
```

## Cold Start: Resuming from a Checkpoint

When starting a new session on an existing branch:

1. **Find the issue** — extract ticket prefix from branch name, search with `gh issue list`
2. **Read the living comment** — `gh api repos/OWNER/REPO/issues/NUMBER/comments`
3. **Reconstruct context** — check status, read Built/Not Wired/TODOs/Decisions
4. **Verify locally** — `git log --oneline -10`, check working tree matches checkpoint
5. **Resume from first unchecked TODO**

## When to Checkpoint

| Event | Action |
|-------|--------|
| Branch created | Create issue + living comment with branch name |
| Code committed | Update Built section + latest commit |
| Plan created (plan mode) | Link or inline the plan in checkpoint |
| Task completed (subagent execution) | Check off in Built, update status |
| New TODO found | Append to TODOs (edit, don't post new comment) |
| TODO done | Check it off |
| Decision made | Record in Decisions section |
| Session ending | Ensure checkpoint is current |
| Handing off | Add "Handoff notes" with immediate next step |

## Lifecycle

| Phase | Checkpoint Action |
|-------|-------------------|
| Start | Create issue, first living comment |
| Plan | Link plan file or paste summary |
| Implement | Update Built/TODOs after each commit |
| Review | Set status to `ready-for-review`, link PR |
| Merge | Close issue (checkpoint is the historical record) |
