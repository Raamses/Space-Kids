---
description: Ship (The Check-In Protocol)
---

# Workflow: Ship (The Check-In Protocol)

## Step 1: Quality Assurance & Linting
**Agent:** Orion (Architect)
- Run `npm run lint` and `npm run build` to ensure no 3D texture breaks the build.
- **Action:** If errors found, fix them before proceeding.

## Step 2: Safety & RTL Validation
**Agent:** Guard (Security) + Nova
- Guard: Verify no API keys or child-data-leaking scripts are present.
- Nova: Verify that logical CSS properties are used for RTL support in the changed files.

## Step 3: Commit Message Generation
**Agent:** Master Orchestrator
- Summarize the changes made by all agents in this session.
- Format the message according to @git.md.

## Step 4: The Final Gate
**Agent:** Orion (Architect)
- Present the final diff and the proposed commit message.
- **Stop and Wait:** Await user command: "Push" or "Cancel."

## Step 5: Execution
- **Action:** Execute `git add .`, `git commit -m "[message]"`, and `git push`.