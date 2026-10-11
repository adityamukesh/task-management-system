#!/usr/bin/env bash

# Check gh CLI authentication
if ! gh auth status >/dev/null 2>&1; then
  echo "Error: You must be logged into GitHub CLI first."
  echo "Run: gh auth login"
  exit 1
fi

node "$(dirname "$0")/create_github_issues.js"
