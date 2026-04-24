# Documentation Improvement Plan

## How to Use This File

This file tracks documentation gaps in the project. To act on it:

1. Open a new GitHub Copilot Chat in Agent mode.
2. Reference a specific item, e.g.: _"Create the `.claude/skills/firebase-patterns/SKILL.md` file from the docs-improvement-plan."_
3. The agent will explore the relevant source files (e.g. `src/firebase.js`, `functions/`) and generate the skill file from actual code — not just placeholders.
4. Once a file is created and verified, mark its entry from this plan by `✅ done`.

The goal is to fill these files with real project knowledge so future agent sessions need less time reading source files and can act immediately with full context.

---

Suggested MD files to improve AI assistant efficiency in this project.

## High Priority

### `.claude/skills/firebase-patterns/SKILL.md`

- App Check configuration details
- Emulator auto-detection logic (firebase.js)
- Custom claims flow (how roles are set/read)
- onCall function conventions (Node 24, v2)
- firstUserRole bootstrap sequence

### `.claude/skills/pdf-export/SKILL.md`

- When to use jsPDF+html2pdf.js vs pdfMake+html-to-pdfmake
- Montserrat font embedding approach
- usePdfExport composable conventions
- TCR (roadbook card) PDF layout structure

### `DOC/DataModel.md`

- Full Firestore field definitions for: users, trips, lines
- Field types, constraints, defaults
- Which fields are optional vs required
- linesCount trigger behavior

## Medium Priority

### `.claude/skills/store-patterns/SKILL.md`

- Inter-store dependencies (lines ↔ trips ↔ auth)
- Error propagation pattern (useError composable)
- When to use storeToRefs vs direct store access

### `DOC/Roles.md`

- user / editor / admin capabilities matrix
- Which routes/components are role-gated
- How guards enforce roles (meta.requiresAuth vs role checks)

## Lower Priority

### `.claude/commands/deploy.md`

- Step-by-step deploy checklist
- Correct ordering of fb-web-\* commands
- Pre-deploy checks (build, emulator test)
