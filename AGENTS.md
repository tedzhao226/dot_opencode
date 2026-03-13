# dot_opencode

Configuration and skills for opencode CLI agent.

## Structure

```
.
├── opencode/           # Main configuration directory
│   ├── AGENTS.md      # Agent instructions and guidelines
│   ├── opencode.json  # MCP server configuration
│   └── skills/        # Custom skills (23 total)
└── README.md          # Setup log and changelog
```

## What This Does

- **AGENTS.md** - Core instructions for opencode agent behavior
- **opencode.json** - MCP servers (serena, chrome-devtools, mcp-docker)
- **skills/** - Curated symlinks generated from `dot_skills`

## Key Features

- Prompt delegation pattern for CLI tools
- Semantic code navigation via Serena MCP
- Browser automation and debugging
- Testing guidelines (Khorikov principles)
- Git/PR workflows

## Usage

This repo is synced to `~/.config/opencode/` via chezmoi or manual copy.
