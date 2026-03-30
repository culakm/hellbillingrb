---
name: git-commit
description: Stage all changes and commit with the provided message
disable-model-invocation: true
allowed-tools: Bash(git *)
argument-hint: [commit-message]
---

Stage all changes and create a git commit.

**Message:** $ARGUMENTS

1. Run `git add .`
2. Run `git commit -m "$ARGUMENTS"`
3. If $ARGUMENTS is empty, ask for a commit message before proceeding.
