---
description: Strategic Oversight & Devil's Advocate
---

# Workflow: Strategic Oversight & Devil's Advocate

## Step 1: Plan Synthesis
**Agent:** Orion (Architect)
- Summarize the current Implementation Plan.
- List all dependencies and architectural choices.

## Step 2: The Devil's Advocate (Red Teaming)
**Agent:** Guard (Security)
- Identify 3 potential "Point of Failure" risks (e.g., Performance on low-end tablets, i18n layout breaks).
- Identify any "Security/Safety" risks regarding the 3.5-yo user base.
- Challenge the "Cash" agent on monetization friction.

## Step 3: Risk Mitigation
**Agent:** Orion + Guard
- For every risk identified in Step 2, provide a specific technical mitigation.
- Update the Implementation Plan Artifact to include these safeguards.

## Step 4: Parental Approval Gate
**Agent:** Master Orchestrator
- Present a final "Summary for Parent" (the User).
- **Stop and Wait:** Do not proceed until the user explicitly says "Proceed to Code."# Workflow: Strategic Oversight & Devil's Advocate (v2.0)

## Step 1: Current State Audit (The "Clean Up")
**Agent:** Orion (Architect)
- **Action:** Scan the existing codebase and generate a `GAMEPLAY_MECHANICS.md` Artifact. 
- **Requirement:** This must explain exactly how the app works today (navigation, logic, i18n hooks) so the user can understand the "Engine."

## Step 2: Visual & UX Critique
**Agent:** Nova (UI/UX)
- **Action:** Compare current graphics against the @global-kids.md standards.
- **Requirement:** Identify 3 areas where the graphics fail to be "appealing" or "easy to understand" for a 3.5-year-old. 
- **Output:** Generate a `VISUAL_REBOOT.md` Artifact with new prompt ideas for Nano Banana (e.g., "vibrant, claymation style" vs "flat vectors").

## Step 3: The Devil's Advocate (Red Teaming)
**Agent:** Guard (Security)
- **Action:** Identify "Point of Failure" risks in the *current* implementation (e.g., "The back button is too small for a toddler," or "The RTL flip makes the spaceship fly backwards").
- **Challenge:** Challenge the "Cash" agent on whether the monetization logic is getting in the way of the fun.

## Step 4: Risk Mitigation & Pivot Plan
**Agent:** Orion + Nova
- **Action:** For every visual or technical flaw identified, provide a fix.
- **Requirement:** Update the Implementation Plan to reflect the "Visual Reboot" and "Documentation First" approach.

## Step 5: Parental Approval Gate (The Hard Stop)
**Agent:** Orion (Architect)
- **Action:** Present the `GAMEPLAY_MECHANICS.md` and the `VISUAL_REBOOT.md`.
- **STOP:** Do not modify any code. Output: "Audit Complete. Please review the mechanics and the visual reboot plan. Type 'Proceed' to apply changes."