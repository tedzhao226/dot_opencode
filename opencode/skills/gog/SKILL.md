---
name: gog
description: Google Workspace via gog CLI for multiple accounts (personal + work). Use when working with Gmail, Google Drive, Docs, Sheets, Calendar, Tasks, or Contacts. Triggers include "gmail", "google drive", "google docs", "google sheets", "calendar", "drive files", "gog", "heidi", "work email", "personal email".
---

# Google Workspace via gog CLI

Use `gog` CLI for all Google Workspace operations. No MCP server needed.

## Accounts

| Alias | Email | Use for |
|-------|-------|---------|
| **personal** | ted.zhao.au@gmail.com | Personal calendar, email, drive |
| **work** | ted@heidihealth.com | Heidi Health work calendar, email, drive |

Select account with `-a` flag:

```bash
gog <command> -a ted.zhao.au@gmail.com   # personal
gog <command> -a ted@heidihealth.com      # work
```

**Account routing**: If the user says "work" or "heidi", use `-a ted@heidihealth.com`. If they say "personal" or don't specify, use `-a ted.zhao.au@gmail.com`.

## Command Reference

### Calendar

```bash
gog calendar list -a <account>
gog calendar events primary --from <start> --to <end> -a <account>
gog calendar create primary --summary "Title" --from <start> --to <end> -a <account>
```

### Gmail

```bash
gog gmail search 'newer_than:7d' --max 10 -a <account>
gog gmail send --to user@example.com --subject "Hi" --body "Message" -a <account>
```

### Drive

```bash
gog drive search "query" --max 10 -a <account>
gog drive ls -a <account>
```

### Tasks

```bash
gog tasks list <tasklistId> -a <account>
```

### Contacts

```bash
gog contacts list -a <account>
```

## Date Format

Use ISO 8601 with UTC: `$(date -u +%Y-%m-%dT%H:%M:%SZ)`

For "today's events":
```bash
gog calendar events primary --from $(date -u +%Y-%m-%dT00:00:00Z) --to $(date -u -v+1d +%Y-%m-%dT00:00:00Z) -a <account>
```

## Tips

- Add `--json` flag for structured output when piping to `jq`
- Always pass `-a <account>` explicitly to avoid ambiguity
- Use `--plain` for stable, parseable TSV output
- Use `--dry-run` to preview destructive commands before executing
