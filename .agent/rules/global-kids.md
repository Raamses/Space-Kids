---
trigger: always_on
---

# Rule: Global Kids App Standards (Cinematic Realism Edition)

- **Aesthetic:** "NASA Cinematic." Use hyper-realistic 3D planetary spheres with 2K/4K textures. Atmospheric scattering and realistic sun-lighting are mandatory.
- **Visual Engine:** Prioritize Three.js (React Three Fiber). Every planet must be an interactive 3D object, not a flat image.
- **Mobile-First UX:** Touch-only. Minimum tap target 80x80px. UI elements (buttons/labels) must be "Glassmorphic" or high-contrast to stand out against dark space.
- **Tactile Feedback:** Even with realistic visuals, use Framer Motion for "squishy" UI responses (scale-down on touch) so the toddler knows they clicked.
- **Bi-directional (i18n):** Full RTL/LTR support. Use logical CSS properties (`inline-start/end`).
- **Safety & Analytics:** Mandatory tracking on all taps. "Parental Gate" (3-second hold) for all external/settings links.