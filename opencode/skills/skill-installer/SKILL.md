---
name: skill-installer
description: Search and install skills with the vercel-labs/skills CLI for both opencode and Codex. Use when the user asks to find, list, install, remove, check, or update skills.
---

# Skill Installer

Use [`vercel-labs/skills`](https://github.com/vercel-labs/skills) as the default install method.

Default scope for this workspace:
- Install to both agents: `-a claude-code -a codex`
- Install globally: `-g`
- Non-interactive by default: `-y`

## Default Commands

### Search Skills (Discovery First)

```bash
# Search public skills index by keyword
npx -y skills find <query>

# Interactive search (if the user asks to browse)
npx -y skills find

# List skills from a specific source repo/path
npx -y skills add <source> --list
```

### List Skills In A Source

```bash
npx -y skills add <source> --list
```

Examples:
- `npx -y skills add vercel-labs/agent-skills --list`
- `npx -y skills add https://github.com/org/repo/tree/main/skills --list`

### Install One Skill For Claude + Codex

```bash
npx -y skills add <source> --skill <skill-name> -g -a claude-code -a codex -y
```

Example:
- `npx -y skills add vercel-labs/agent-skills --skill frontend-design -g -a claude-code -a codex -y`

### Install All Skills From A Source

```bash
npx -y skills add <source> --skill '*' -g -a claude-code -a codex -y
```

### Remove Skills

```bash
npx -y skills remove <skill-name> -g -a claude-code -a codex -y
```

### Check Or Update Installed Skills

```bash
npx -y skills check
npx -y skills update -y
```

## Communication

When searching skills, format results like:
"""
Top matches for "<query>":
1. skill-a - short reason
2. skill-b - short reason
3. skill-c - short reason
Install one for Claude + Codex?
"""

When listing skills, format results like:
"""
Skills from <source>:
1. skill-1
2. skill-2
3. ...
Which skills should I install for Claude + Codex?
"""

After install/remove/update operations, tell the user:
"Restart Codex and opencode to reload skill metadata."
