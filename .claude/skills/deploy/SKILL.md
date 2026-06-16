---
name: deploy
description: Deploys our codebase to either staging or production.
model: sonnet
allowed-tools: [Bash(npm run:*)]
---

# Deploy

1. Run the tests
2. Bundle the app
3. Deploy to $ARGUMENTS