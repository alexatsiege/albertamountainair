# Skill: Import from v2 Template

Import a page, page layout, or component from the v2 template library into this client site — automatically rebranded with client colors, business info, and tracking configuration.

## Trigger Prompt
```
Import [page / component / layout] from the v2 template. Follow the import skill at docs/skills/import-from-v2.md
```

**Examples:**
```
Import the heat-pump-installation-anytown page from the v2 template. Follow the import skill at docs/skills/import-from-v2.md
Import the QualifyForm component from the v2 template. Follow the import skill at docs/skills/import-from-v2.md
Import the service-seo page layout from the v2 template. Follow the import skill at docs/skills/import-from-v2.md
```

---

## Paths

| Location | Path |
|----------|------|
| v2 Template root | `Website Builder \| Anti Gravity/v2-astro-builder-website-template/` |
| v2 Components | `v2-…/src/components/` |
| v2 Page content | `v2-…/src/content/pages/` |
| v2 Client YAML | `v2-…/src/content/clients/siege-digital-marketing.yaml` |
| v2 config.ts | `v2-…/src/content/config.ts` |
| v2 [page].astro | `v2-…/src/pages/[client]/[...page].astro` |
| **This site root** | _(current working directory)_ |
| This site components | `src/components/` |
| This site pages | `src/content/pages/` |
| This site client YAML | `src/content/clients/*.yaml` |
| This site formRegistry | `src/content/formRegistry.ts` |
| This site config.ts | `src/content/config.ts` |

---

## Step 0 — Mode Detection

**Ask the user:**

> **What are you importing?**
> - A) **Page content** — a `.md` page file (headlines, copy, FAQ, etc.) rebranded for this client
> - B) **Component** — an `.astro` component file (design/UI module)
> - C) **Page layout** — a full template type (registers in config.ts + [page].astro + components)

---

## MODE A — Import Page Content

### A1. List Available v2 Pages

Read all files in `v2-…/src/content/pages/`. Show the user a table:

```
Available v2 template pages:
  1. siege-digital-marketing--home.md          (home)
  2. siege-digital-marketing--about.md         (about)
  3. siege-digital-marketing--heat-pump-…      (service)
  …
```

**Ask:** Which page do you want to import?

### A2. Read Source Page

Read the chosen v2 page file. Note:
- `template` type
- All frontmatter fields and values
- All body content (if any below the `---`)

### A3. Read This Client's Config

Read:
1. `src/content/clients/*.yaml` — get `businessName`, `city`, `state`, `phone`, colors, services, service areas, images
2. `src/content/formRegistry.ts` — get all valid `formId` and `phoneId` options

### A4. Ask Required Questions

Ask **all** of these in order. Do not skip any. Do not generate files until all are answered.

| # | Question | Notes |
|---|----------|-------|
| 1 | **New page slug** — What URL for this page? | e.g. `ac-repair-fort-lauderdale`, `heat-pump-naples` |
| 2 | **Template type** — Keep `[source type]` or change? | Show available types from this site's `config.ts` enum. If the source is `service` and this site supports `service-seo`, ask if they want the upgrade. |
| 3 | **formId** — Which form? | List all from `formRegistry.ts` with labels. User must choose. |
| 4 | **phoneId** — Which tracking number? | List all from `formRegistry.ts` with numbers. User must choose. |
| 5 | **Target city** — What city/location is this page for? | Used for all rebranding replacements. |
| 6 | **Focus keyword** — Primary SEO keyword? | Always ask fresh — never inherit. |
| 7 | **Headline** — Show v2's headline, ask: keep (rebranded) or write new? | Auto-replace city/business if keeping. |
| 8 | **Meta title** — Auto-generate with client branding, confirm. | Must contain focus keyword near the front. |
| 9 | **Meta description** — Auto-generate with client branding, confirm. | Max 160 chars. Must contain focus keyword. |
| 10 | **Header variant** — `ppc` or `full`? | Default to client YAML's `headerVariant`. |

**Rules:**
- `formId` and `phoneId` are ALWAYS asked — never inherited from source
- `focusKeyword` is ALWAYS asked — each page needs its own keyword strategy
- For all other text fields: auto-rebrand and show the user for confirmation

### A5. Auto-Rebrand Content

Perform these find-and-replace operations on ALL text fields (headline, subheadline, bullets, split blocks, FAQ answers, meta fields, body content):

| Find (case-insensitive) | Replace With |
|---|---|
| `Siege Digital Marketing` | Client's `businessName` |
| `Siege HVAC` | Client's `businessName` |
| `Siege` (when clearly the business name) | Client's `businessName` |
| `Anytown, MA` | `[Target City], [State]` |
| `Anytown` | `[Target City]` |
| `MA` (when clearly the state) | Client's `state` |
| `(555) 555-5555` | _(remove — phone comes from phoneId at render time)_ |
| `/placeholder-hero.jpg` | Client's hero image from YAML (or leave as-is with a `TODO` comment) |
| `/placeholder-truck.jpg` | Client's `truckSrc` from YAML |
| `/placeholder-team.jpg` | Client's `techCutout` from YAML |
| `/placeholder-logo.png` | Client's `logoSrc` from YAML |
| `/placeholder-image.jpg` | Leave with `TODO: replace with client image` comment |
| `contact-form` (the v2 default) | Chosen `formId` |
| `main` (the v2 default phoneId) | Chosen `phoneId` |

**Apply focus keyword throughout:**
- **heroHeadline** — must contain the exact focus keyword
- **split block headlines** — keyword or close semantic variant
- **metaTitle** — keyword near the front
- **metaDescription** — keyword in the first sentence
- **Image alt tags** — keyword or semantically related terms
- **Body copy** — sprinkle naturally, do not keyword-stuff

### A6. Write the Page File

Write to: `src/content/pages/[client-slug]--[new-slug].md`

Find the client slug by reading existing filenames in `src/content/pages/` (e.g. `one-way-air--`, `south-shore-hvac--`).

Never leave any `[placeholder]` text in the final file.

### A7. Build & Validate

```bash
npm run build
```
- ✅ Passes → proceed to commit
- ❌ Fails → read the error, fix, retry

### A8. Commit & Push

```bash
git add -A
git commit -m "feat: import [new-slug] page from v2 template (formId: [chosen], phoneId: [chosen])"
git push origin main
```

---

## MODE B — Import Component

### B1. List Available v2 Components

Read all `.astro` files in `v2-…/src/components/`. Also read this site's `src/components/`. Show a diff:

```
v2 components available to import:
  ✅ Already here: HeroTrust, FiftyFifty, Reviews, CTA, …
  🆕 New (not in this site): [list any missing]

Which component do you want to import?
```

### B2. Read Source Component

Read `v2-…/src/components/[ComponentName].astro`. Note:
1. All props in `interface Props {}`
2. All imported sub-components
3. Any hardcoded strings, colors, or placeholders

### B3. Pre-flight: Check Sub-imports

For every `import X from './X.astro'` in the component:
- Check if `X.astro` exists in this site's `src/components/`
- If missing → import it first (apply Mode B recursively)

### B4. Rebrand the Component

Read this client's YAML. Apply:

| Find | Replace With |
|---|---|
| `(555) 555-5555` | `phone` prop (should already be a prop — verify) |
| `[Business Name]` or `Siege Digital Marketing` | `businessName` prop or `clientName` prop |
| `[City, State]` or `Anytown` | `cityName` prop or `townName` prop |
| `/placeholder-*.jpg` | Map to client image props or leave as prop-driven |
| `var(--color-primary)` | ✅ Keep as-is (already theme-agnostic) |
| `#2563EB` or other hardcoded hex | `var(--color-primary)` / `var(--color-accent)` |

**Do NOT change:**
- Component logic, animations, CSS structure
- Prop names and interface shape
- Anything already received through props
- CSS custom properties (`var(--color-*)`) — already theme-agnostic

### B5. Write Component

Write to: `src/components/[ComponentName].astro`

If the file already exists, **ask the user:**
> `[ComponentName].astro` already exists in this site. Overwrite with the v2 version? (This will replace the current file.)

### B6. Check config.ts Schema

If the component uses frontmatter fields that don't exist in this site's `config.ts`:
1. List the missing fields
2. Add them to the page schema with appropriate Zod types
3. Show the user what was added

### B7. Check [page].astro Integration

If the component isn't already imported and rendered in `src/pages/[page].astro`:
1. Show the user where it should be added in the template flow
2. Ask which template types should include it (home, service, location, etc.)
3. Add the import and render block

### B8. Build & Validate

```bash
npm run build
```
- ✅ Passes → commit
- ❌ Fails → fix error (missing prop, import, or enum), retry

### B9. Commit & Push

```bash
git add -A
git commit -m "feat: import [ComponentName] component from v2 template

- Rebranded for [client name]
- [Sub-components imported: list, if any]
- [Config fields added: list, if any]"
git push origin main
```

---

## MODE C — Import Page Layout

A page layout is a complete template type — it controls which components appear and in what order. This is the most involved import mode.

### C1. Read v2 Template Types

Read `v2-…/src/content/config.ts` and extract the `template` enum values.  
Read this site's `src/content/config.ts` and compare.

```
v2 template types:     home, service, location, about
This site types:       home, service, location, about, service-seo, quote

Which template type do you want to import?
(If the template already exists here, we'll update it to match v2's latest version.)
```

### C2. Read v2 Page Router

Read `v2-…/src/pages/[client]/[...page].astro` (or equivalent).  
Find the conditional block for the chosen template type.  
Note all components used in that template's render flow.

### C3. Import Missing Components (Mode B)

For each component referenced in the layout block:
- Check if it exists in this site's `src/components/`
- If missing → run Mode B for that component (recursive)
- If it exists → compare prop interfaces. Flag any new props the layout block passes that the local component doesn't accept yet.

### C4. Register Template in config.ts

If the template type doesn't exist in this site's `config.ts` `template` enum:

```typescript
// Before:
template: z.enum(['home', 'service', 'location', 'about']).default('service'),

// After:
template: z.enum(['home', 'service', 'location', 'about', '[new-type]']).default('service'),
```

Also add any new frontmatter fields the template requires.

### C5. Add Render Block to [page].astro

Read this site's `src/pages/[page].astro`.  
Add:
1. Import statements for any new components
2. The template's conditional render block, adapted from the v2 source:
   - Replace v2 component prop patterns with this site's patterns
   - Add a clear comment header: `{/* ── [Layout Name] Template ── */}`
   - Wire up client YAML props correctly

### C6. Create Demo Page

Create a demo page to verify the layout works:

```yaml
---
template: [new-type]
metaTitle: "[Layout Name] Template Demo | [Business Name]"
metaDescription: "Demo of the [layout name] template for [Business Name]."
formId: "[first available formId]"
phoneId: "[first available phoneId]"
heroHeadline: "[Business Name] — [Layout Name] Demo"
heroSubheadline: "This is a demo page to verify the imported layout renders correctly."
heroBullets:
  - "Imported from v2 template"
  - "Rebranded for [Business Name]"
# fill all required fields with client-branded placeholder content
---
```

### C7. Build & Validate

```bash
npm run build
```
- ✅ Passes → commit
- ❌ Fails → fix errors, retry

### C8. Commit & Push

```bash
git add -A
git commit -m "feat: import [layout-name] page layout from v2 template

- Registered template '[name]' in config.ts
- Components imported: [list]
- Demo page: /[slug]-demo
- Config fields added: [list]"
git push origin main
```

---

## Report to User

### Mode A (Page Content):
```
✅ Page imported: /[new-slug]

Source:    v2 template → [source-page-filename]
Target:   [client-slug]--[new-slug].md
formId:   [chosen]
phoneId:  [chosen]
Keyword:  [focus keyword]
Template: [type]

Rebranded:
  - Business name: Siege → [client name]
  - City: Anytown → [target city]
  - [other replacements made]

Build: [X] pages ✅ | Pushed to main
```

### Mode B (Component):
```
✅ Component imported: [ComponentName]

Source:    v2 template
Target:   src/components/[ComponentName].astro

Rebranded:
  - [list changes]

Sub-components: [imported / already present]
Config fields:  [added / none needed]
[page].astro:   [integrated / user action needed]

Build: [X] pages ✅ | Pushed to main
```

### Mode C (Page Layout):
```
✅ Layout imported: [layout-name]

Source:       v2 template
Template:     '[name]' registered in config.ts
Components:   [X] imported, [Y] already present
Demo page:    /[slug]-demo

Config changes:
  - template enum: added '[name]'
  - [new fields added]

Build: [X] pages ✅ | Pushed to main
```

---

## Common Pitfalls

- **formId / phoneId mismatch** — v2 uses `contact-form` / `main`. These NEVER carry over — always ask for the target site's values.
- **Missing image assets** — v2 uses `/placeholder-*.jpg`. If the client YAML has real images, map them. If not, leave a `TODO` comment.
- **Template enum not updated** — If importing a layout, the `config.ts` enum MUST be updated BEFORE the build or Astro will reject the new template type.
- **Hardcoded hex colors in components** — v2 should be clean, but double-check. Replace any hardcoded hex with `var(--color-primary)` / `var(--color-accent)`.
- **Sub-component imports** — Always check that every `import` in a component resolves to an existing file in this site's `src/components/`.
- **City-specific conditional logic** — If a v2 component has `if city === 'Anytown'` style logic, make it data-driven via props.
- **Config field gaps** — v2's `config.ts` is simpler. This site may have extra fields (e.g. `pricingFactors`, `symptoms`). The v2 page won't use them, but they're available for enhancement after import.
