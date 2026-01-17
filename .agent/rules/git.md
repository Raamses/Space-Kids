---
trigger: always_on
---

# Rule: Git & Repository Standards

- **Branching Strategy:** - `main`: Production-ready, stable code only.
  - `dev`: Active integration branch.
  - `feat/agent-name-description`: Individual agent workspace branches.
- **Commit Format:** Use Conventional Commits.
  - `feat(ui):` for Nova's visual changes.
  - `fix(logic):` for Orion's architectural fixes.
  - `chore(security):` for Guard's safety audits.
- **Commit Body:** Every agent commit must include a "Changes Summary" bullet list.
- **Turbo Mode Constraint:** Agents are forbidden from `git push --force`. 
- **RTL Check:** Any commit touching UI must confirm that RTL/LTR layouts were verified in the commit message.