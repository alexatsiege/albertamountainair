#!/bin/bash
# ════════════════════════════════════════════════════════════
# new-client.sh — Spin up a new client site from the template
# 
# Usage:  ./new-client.sh smith-plumbing
# Result: Creates ../smith-plumbing-astro/ — a fully isolated
#         copy of this project ready to fill in and deploy
# ════════════════════════════════════════════════════════════

set -e

CLIENT_SLUG="$1"

if [ -z "$CLIENT_SLUG" ]; then
  echo "❌  Usage: ./new-client.sh client-slug"
  echo "    Example: ./new-client.sh smith-plumbing"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
DEST="$PARENT_DIR/${CLIENT_SLUG}-astro"

if [ -d "$DEST" ]; then
  echo "❌  $DEST already exists. Choose a different slug or delete the existing folder."
  exit 1
fi

echo ""
echo "🚀  Creating new client site: $CLIENT_SLUG"
echo "    Source:      $SCRIPT_DIR"
echo "    Destination: $DEST"
echo ""

# ── Copy the full project (excluding node_modules, .git, dist) ──
rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.vercel' \
  --exclude='.astro' \
  "$SCRIPT_DIR/" "$DEST/"

# ── Create client content folder from templates ──
mkdir -p "$DEST/src/content/clients"
mkdir -p "$DEST/src/content/pages"
mkdir -p "$DEST/public/_assets"

cp "$DEST/NEW-CLIENT-INTAKE.yaml" "$DEST/src/content/clients/${CLIENT_SLUG}.yaml"
cp "$DEST/_templates/CLIENT--home.md"          "$DEST/src/content/pages/${CLIENT_SLUG}--home.md"
cp "$DEST/_templates/CLIENT--about.md"         "$DEST/src/content/pages/${CLIENT_SLUG}--about.md"
cp "$DEST/_templates/CLIENT--service-page.md"  "$DEST/src/content/pages/${CLIENT_SLUG}--service-1.md"
cp "$DEST/_templates/CLIENT--location-page.md" "$DEST/src/content/pages/${CLIENT_SLUG}--location-1.md"

# Remove other clients' content (isolate to this client only)
find "$DEST/src/content/clients/" -name "*.yaml" ! -name "${CLIENT_SLUG}.yaml" -delete
find "$DEST/src/content/pages/"   -name "*.md"   ! -name "${CLIENT_SLUG}--*"   -delete

# ── Install dependencies ──
echo "📦  Installing dependencies..."
cd "$DEST" && npm install --silent

echo ""
echo "✅  Client project created!"
echo ""
echo "Next steps:"
echo "  1. Open: $DEST/src/content/clients/${CLIENT_SLUG}.yaml"
echo "     → Fill in ALL fields (name, phone, colors, images, etc.)"
echo ""
echo "  2. Drop client images into: $DEST/public/_assets/"
echo "     (logo, truck, tech cutout, hero background)"
echo ""
echo "  3. Edit page files in: $DEST/src/content/pages/"
echo "     → Update headlines, body copy, FAQs"
echo ""
echo "  4. Deploy:"
echo "     cd $DEST && ./publish.sh"
echo ""
