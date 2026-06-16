# Skill: Page Export / Import

Export a component or page layout from any client site and import it into the v2 template builder — stripped of all client branding, ready to reuse.

## Trigger Prompt
```
Export [ComponentName / "the [PageName] page layout"] from [Site Name] into the v2 template. Follow the Page Export / Import skill at docs/skills/page-export-import.md
```

**Examples:**
```
Export the HowItWorks component from Southshore HVAC into the v2 template. Follow the Page Export / Import skill at docs/skills/page-export-import.md
Export the PPC heat pump page layout from Southshore HVAC into the v2 template. Follow the Page Export / Import skill at docs/skills/page-export-import.md
```

---

## Paths

| Location | Path |
|----------|------|
| v2 Template root | `Website Builder | Anti Gravity/v2-astro-builder-website-template/` |
| Client sites root | `Website Builder | Anti Gravity/[Site Name]/` |
| Component gallery page | `v2-template/src/content/pages/siege-digital-marketing--component-gallery.md` |

---

## Execution Steps

### PHASE 1 — Read & Analyze Source

1. Read `[Site Name]/src/components/[ComponentName].astro`
2. List all props in the `interface Props {}` block
3. Grep for hardcoded client strings:
   - Business/company names
   - Phone numbers `\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}`
   - City or location names hardcoded in HTML text (not in logic/props)
   - `/_assets/` paths with client-specific filenames
   - External URLs pointing to client domains
   - GTM IDs, WhatConverts account numbers, reCAPTCHA keys

### PHASE 2 — Genericize

| Find | Replace With |
|------|-------------|
| Hardcoded phone | `(555) 555-5555` or `phone` prop |
| Business name | `[Business Name]` or `businessName` prop |
| City/location text | `[City, State]` or `cityName` prop |
| `/_assets/client-image.jpg` | `/placeholder-[type].jpg` (see below) |
| Client domain URLs | `#` or remove |
| GTM / WhatConverts / reCAPTCHA IDs | Remove entirely |
| Hardcoded hex colors e.g. `#ab1d20` | `var(--color-primary)` or a prop |

**Asset placeholder mapping:**
- Hero / background image → `/placeholder-hero.jpg`
- Truck / vehicle → `/placeholder-truck.jpg`
- Team member photo → `/placeholder-team.jpg`
- Logo → `/placeholder-logo.png`
- Anything else → `/placeholder-image.jpg`

> If placeholder files are missing from `public/`, note it in the report.

**Do NOT change:**
- Component logic, animations, CSS structure
- Prop names and interface shape
- Anything already received through props (already generic)
- CSS variables `var(--color-*)` — already theme-agnostic

### PHASE 3 — Copy to v2 Template

1. Write genericized file to `v2-template/src/components/[ComponentName].astro`
2. Check all imports — if a sub-component is imported but missing in v2, backport it first (apply this skill recursively)

### PHASE 4 — Register in Component Gallery

Open (or create) `v2-template/src/content/pages/siege-digital-marketing--component-gallery.md`

Add to the `components:` frontmatter list:
```yaml
components:
  - name: "[ComponentName]"
    description: "[One sentence: what does this component do?]"
    props:
      - "[key prop]: [example value]"
```

If the file doesn't exist yet, create it:
```yaml
---
template: component-gallery
metaTitle: "Component Gallery | Anti Gravity Builder"
metaDescription: "All available components in the Anti Gravity website builder template."
formId: "contact-form"
phoneId: "main"
components:
  - name: "[ComponentName]"
    description: "..."
---
```

### PHASE 5 (Page Layout Only) — Register Template

Only run this phase when backporting a full page layout, not a single component.

**5a — Add enum to `config.ts`:**
```typescript
template: z.enum(['home', 'service', 'location', 'about', '[new-name]']).default('service'),
```

**5b — Add block to `[page].astro`:**
- Copy the layout's conditional block from the source site's `[page].astro`
- Strip all client-specific prop references
- Add comment header: `{/* ── [Layout Name] Template ── */}`

**5c — Create demo page:**
```yaml
---
template: [new-name]
metaTitle: "[Layout Name] Template Demo"
metaDescription: "Demo of the [layout name] page layout."
formId: "contact-form"
phoneId: "main"
heroHeadline: "Your Headline Goes Here"
heroSubheadline: "Supporting subheadline text goes here."
# fill all required fields with generic placeholder content
---
```

### PHASE 6 — Build

```bash
npm run build
```

- ✅ Build passes → commit
- ❌ Build fails → fix error (missing prop, import, or enum), then retry

### PHASE 7 — Commit & Push

```bash
git add -A
git commit -m "feat: backport [ComponentName] from [Site Name]

- Genericized: [list what was removed/replaced]
- Added to component gallery
- [If layout]: registered template '[name]', demo page at /[slug]-demo"
git push origin main
```

---

## Report to User

```
✅ Backport complete: [ComponentName]

Source: [Site Name]
Destination: v2 template

Genericized:
  - [list changes made]

Props: [key props]
Gallery: Added ✅
[Layout only] Template '[name]' registered | Demo: /[slug]-demo

Build: [X] pages ✅ | Pushed to main
```

---

## Common Pitfalls

- **Hardcoded hex colors** — replace with `var(--color-primary)` / `var(--color-accent)` or a prop
- **City-specific conditional logic** e.g. `if city === 'Fort Lauderdale'` — make data-driven
- **Inline scripts with tracking IDs** — GTM, WhatConverts, reCAPTCHA — remove entirely from template
- **Missing sub-component imports** — verify every imported component exists in v2 before writing the file

---

## See Also

- **Import from v2 → client site:** Each client site has `docs/skills/import-from-v2.md` — the reverse of this skill. It pulls pages, components, or page layouts FROM this v2 template INTO a client site, automatically rebranding with the client's business info, colors, and tracking config.
