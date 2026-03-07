# Task Routing Detailed Table

> On-demand loading. Tier 1 (evaluate escalation) stays in AGENTS.md.

## Tier 2: Opus Exclusive Scenarios

| Task Type | Route | Notes |
|-----------|-------|-------|
| Critical logic/secrets/credentials | **Opus exclusive** | Safety floor, never outsource |
| Data analysis/core metrics/business logic | **Opus exclusive** | Optional: Opus -> Codex verify |
| Critical code review | **Opus lead -> Codex audit** | Multi-model cross-check |
| New feature >50 lines (critical) | **Opus write -> Codex review** | Maker-checker |
| Bug fix (critical) | **Opus fix -> Codex verify** | Prevent regression |

## Tier 3: External Model Assistance

| Task Type | Route | Notes |
|-----------|-------|-------|
| Code review (non-critical) | **Sonnet -> Codex** | Codex deep reasoning |
| Complex refactor/cross-file changes | **Codex** | Suitable for >100 line non-sensitive refactors |
| Cross-verification/second opinion | **Codex** (fallback: alternative) | Different model family, independent verification |
| Simple queries/formatting/search | **Haiku (subagent)** | Fastest, cheapest |

## Model Cost Overview

| Tier | Model | Typical Scenario | Method | Status |
|------|-------|-----------------|--------|--------|
| **L1 Top** | Opus | Critical/complex reasoning | Main/subagent | Active |
| **L2 Workhorse** | Sonnet | Daily dev/analysis | Main session | Active |
| **L3 Economy** | Haiku | Simple queries/subagent | Subagent | Active |
| **L3 Audit** | Codex | Code review/cross-verify | Subagent | Active |

---

*Customize models and costs based on your subscriptions and available tools.*
