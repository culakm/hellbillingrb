---
name: git-commit
description: Stage all changes and commit with the provided message
disable-model-invocation: true
allowed-tools: Bash(git *)
argument-hint: [commit-message]
---

Stage changes and create a git commit.

**Message:** $ARGUMENTS

1. If $ARGUMENTS is empty, ask for a commit message before proceeding.
2. Run `git status` to review what will be staged.
3. Stage specific changed files with `git add <file>...` — avoid staging `.env*`, `dist/`, or build artifacts.
4. Run `git commit -m "$ARGUMENTS"`
