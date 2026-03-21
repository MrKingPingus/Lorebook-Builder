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
  # Inject platform CSS as JS variables (template literals)
  printf 'var _DESKTOP_CSS = `\n'
  cat src/desktop.css
  printf '`;\n'
  printf 'var _MOBILE_CSS = `\n'
  cat src/mobile.css
  printf '`;\n'
  cat src/shared.js
  cat src/mobile-ui.js
  cat src/mobile-entries.js
  cat src/mobile-editor.js
  cat src/mobile-io.js
  cat src/desktop-ui.js
  cat src/desktop-entries.js
  cat src/desktop-search.js
  cat src/desktop-io.js
  printf '\n'
  cat src/init.js
  printf '</script>\n</body>\n</html>\n'
} > index.html

echo "Built index.html ($(wc -l < index.html) lines)"
