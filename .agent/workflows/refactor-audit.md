---
description: Refactor & Flow Audit
---

# Workflow: Refactor & Flow Audit

## Step 1: Logic & Flow Extraction
**Agent:** Orion (Architect)
- Analyze the target file and explain its current "User Flow" in plain English.
- Identify "Code Smells" (e.g., hardcoded strings instead of i18n, inefficient 3D rendering).

## Step 2: Visual & UX Critique
**Agent:** Nova (UI/UX)
- Evaluate if the UI in this file truly hits the "Cinematic Realism" and "Mobile-First" targets.
- Check for RTL/LTR layout breaks.

## Step 3: Optimization & Security
**Agent:** Guard (Security) + Orion
- Identify performance bottlenecks (e.g., unoptimized textures).
- Ensure the "Parental Gate" logic is robust if applicable to this page.

## Step 4: Refactor Proposal
**Agent:** Orion (Architect)
- Generate a `REFACTOR_PROPOSAL.md` Artifact showing "Before" and "After" logic.
- **Stop and Wait:** Do not apply changes until the user approves the refactor plan.