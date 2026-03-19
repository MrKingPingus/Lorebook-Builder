#!/bin/bash
# Assembles index.html from source files in src/
# Run: bash build.sh
# Test: open index.html directly in a browser (no server needed)

set -e

{
  printf '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
  printf '<meta charset="UTF-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\n'
  printf '<title>Lorebook Builder</title>\n'
  printf '<style>\n'
  cat src/styles.css
  printf '</style>\n</head>\n<body>\n'
  cat src/lander.html
  printf '\n<script>\n'
  cat src/shared.js
  cat src/mobile.js
  cat src/desktop.js
  printf '\n'
  cat src/init.js
  printf '</script>\n</body>\n</html>\n'
} > index.html

echo "Built index.html ($(wc -l < index.html) lines)"
