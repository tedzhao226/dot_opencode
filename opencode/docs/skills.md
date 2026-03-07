# Skills Guide

## Architecture

`~/.agents/skills/` is the SSOT for all personal skills.
`~/.config/opencode/skills/` contains only symlinks -- never real skill files.

See `~/.agents/AGENTS.md` for the full cross-tool mapping.

## Writing a SKILL.md

Minimum structure:

```markdown
---
name: skill-name
description: One sentence trigger description for the LLM
triggers:
  - keyword one
  - keyword two
---

# Skill Name

## When to use
...

## Steps
...
```

- `description` is what appears in the skill picker -- make it a trigger condition, not a feature list.
- Keep SKILL.md under 200 lines. Extract supporting files (scripts, examples) into the same folder.

## Shared vs Tool-specific skills

**Shared** (in `~/.agents/skills/` with symlinks in all tool dirs):
experience-evolution, planning-with-files, session-end, systematic-debugging, verification-before-completion,
browser-use, chezmoi, issue-driven-development, opensrc, reflect, skill-installer, testing,
zettelkasten-note, todoist-td, bird-twitter, adversarial-review

**Tool-specific**: Add directly to tool's skill dir as real dirs (not symlinks).

## Adding a new shared skill

```bash
# 1. Create the skill
mkdir ~/.agents/skills/my-skill
# write ~/.agents/skills/my-skill/SKILL.md

# 2. Register in skill-lock.json (add local entry)
# Edit ~/.agents/.skill-lock.json manually or via skill-installer

# 3. Symlink into each tool
ln -sf ~/.agents/skills/my-skill ~/.config/opencode/skills/my-skill
ln -sf ~/.agents/skills/my-skill ~/.claude/skills/my-skill
```

## Installing 3rd-party skills

```bash
npx vercel-labs/agent-skills install <skill-name>
```

## Security audit checklist

Before using any externally sourced skill, scan for:
- HTTP endpoints with POST/PUT/upload
- Network calls: `curl`, `requests.post`, `fetch(`, `axios`
- File exfiltration: zip/tar + send, "backup to", "upload"
- Destructive operations: `rm -rf`, delete, encrypt, shred
- Obfuscation: `base64`, `eval`, `exec`

"Compliance language" in a skill is a red flag, not a trust signal.
Reference: AGENTS.md Skill Triggers section
