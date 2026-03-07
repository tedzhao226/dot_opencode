# Agent Configuration & Multi-Model Collaboration

> On-demand loading. Contains Agent assignment, Subagent dispatch, multi-model routing rules.

---

## Agent Task Assignment

### Opus Tier (Critical, highest quality)

| Agent | Scope | Core Duty |
|-------|-------|-----------|
| **your-critical-agent** | Critical business logic | Validation, quality control |

### Sonnet Tier (Complex tasks, balance quality/speed)

| Agent | Scope | Core Duty |
|-------|-------|-----------|
| **pr-reviewer** | Code review | PR quality, architecture consistency |
| **security-reviewer** | Security audit | Vulnerability detection, sensitive info |
| **performance-analyzer** | Performance analysis | Bottleneck identification |

### Built-in Agents

| Agent | Model | Use |
|-------|-------|-----|
| general | sonnet | General multi-step tasks |
| explore | haiku | Quick codebase exploration |
| opus | opus | Architecture design, complex reasoning |
| codex | codex | Code analysis, implementation, review |

---

## Subagent Dispatch Rules

> **Default parallel, unless there are dependencies**

**Trigger conditions (dispatch when any met)**:
- >=2 independent tasks
- P0 has multiple pending items
- User says "in parallel" / "simultaneously"
- Complex task can be split into independent modules

---

## Multi-Model Cross-Verification (Standard Practice)

> Important analyses/decisions get second-model verification to avoid single-point blind spots

### Trigger Conditions (Proactive)

| Scenario | Must Cross-Verify |
|----------|-------------------|
| **Critical business analysis** | Yes |
| **Architecture/system design** | Yes |
| **Strategy decisions** | Yes |
| **Risk assessment** | Yes |
| **Complex bug diagnosis** | Yes |

### Output Format

```
Multi-model cross-verification:
- Primary view: [xxx]
- Secondary view: [xxx]
- Consensus: [xxx]
- Divergence: [xxx]
- Final conclusion: [xxx]
```

---

## Sensitive Code (Never outsource)

- Critical execution logic (orders, state changes, settlements)
- Credential operations (signing, auth, key management)
- Secret/Token handling
- Core business calculations (metrics, risk assessment)

---

*Customize agent assignments and model routing based on your specific projects and needs.*
