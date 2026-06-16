#!/usr/bin/env bash
# ─────────────────────────────────────────────────────
# publish.sh — Build & Deploy the Anti Gravity Astro site
#
# Usage:
#   ./publish.sh              — build + deploy to production
#   ./publish.sh --preview    — deploy a preview URL only
#   ./publish.sh --build-only — build locally, no deploy
#
# Requirements: Node >=18, Vercel CLI (npm i -g vercel)
# ─────────────────────────────────────────────────────

set -e

PREVIEW=false
BUILD_ONLY=false

for arg in "$@"; do
  case $arg in
    --preview)    PREVIEW=true ;;
    --build-only) BUILD_ONLY=true ;;
  esac
done

echo ""
echo "┌──────────────────────────────────────────┐"
echo "│  Anti Gravity — Astro Website Builder    │"
echo "└──────────────────────────────────────────┘"
echo ""

# ── 1. Build ──────────────────────────────────────
echo "▶  Building..."
npm run build

echo "✅ Build complete — $(find dist -name '*.html' | wc -l | tr -d ' ') pages generated"
echo ""

if $BUILD_ONLY; then
  echo "Build-only mode. Done."
  exit 0
fi

# ── 2. Deploy ─────────────────────────────────────
if $PREVIEW; then
  echo "▶  Deploying preview..."
  URL=$(npx vercel deploy --yes --name "antigravity-astro-builder" 2>&1 | grep -E "^https://" | tail -1)
  echo ""
  echo "✅ Preview live → $URL"
else
  echo "▶  Deploying to production..."
  URL=$(npx vercel deploy --prod --yes --name "antigravity-astro-builder" 2>&1 | grep "Production:" | awk '{print $NF}')
  echo ""
  echo "✅ Production live → $URL"
fi
echo ""
