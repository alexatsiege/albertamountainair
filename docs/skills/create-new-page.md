# Skill: Create New Page

A guided skill for creating or duplicating a page on any client site. Always asks every required question before generating any files.

## Trigger Prompt
```
I need a new page for [Site Name]. Follow the create-new-page skill at docs/skills/create-new-page.md
```

---

## Step 1 — Ask First Question (Mode Detection)

**Before anything else, ask:**

> **"Are you duplicating an existing page, or starting fresh?"**
> - A) Starting fresh — build from a blank template
> - B) Duplicating an existing page — which page slug should I copy from?

If **B**, read the source page from `src/content/pages/` and note: page type, headline, service name, split blocks, FAQ, and all content. These will be inherited. Do not ask the user to repeat them.

---

## Step 2 — Ask All Required Questions

Ask these questions **in order**. Do not skip any. Do not proceed to file generation until all are answered.

| # | Question | Notes |
|---|----------|-------|
| 1 | **New page slug** — What should the URL be? | e.g. `ac-repair-miami`, `hvac-company-near-me` |
| 2 | **Page type** — service / location / home / about | *Skip if duplicating — inherit from source* |
| 3 | **formId** — Which form should this page use? | Read `src/content/formRegistry.ts` and list all valid options. User must choose. |
| 4 | **phoneId** — Which tracking number? | Read `src/content/formRegistry.ts` and list all valid options with numbers. User must choose. |
| 5 | **Headline** — What is the hero headline? | *If duplicating, show the inherited value and ask: keep or change?* |
| 6 | **Service name** — What service does this page cover? | *If duplicating, show the inherited value and ask: keep or change?* |
| 7 | **Meta Title** — Browser tab / Google title | *If duplicating, show the inherited value and ask: keep or change?* |
| 8 | **Meta Description** — Google search snippet (max 160 chars) | *If duplicating, show the inherited value and ask: keep or change?* |
| 9 | **Primary Focus Keyword** — Target SEO keyword | Always ask fresh — never inherit. Used to optimize all headings, image alt tags, and body copy. |

**Rules:**
- `formId` and `phoneId` are **always asked fresh** — never inherited from source, even on duplications
- `Primary Focus Keyword` is **always asked fresh** — each page needs its own keyword strategy
- All other fields on duplication: show the inherited value and ask keep or change

---

## Step 3 — Generate the Page File

### Find the client slug
Read `src/content/pages/` filenames to identify the client prefix (e.g. `jay-moody-hvac--`, `one-way-air--`).

### Write the file
`src/content/pages/[client-slug]--[new-slug].md`

**If creating fresh:** Use `_templates/CLIENT--[page-type].md` as the base structure.
**If duplicating:** Use the source page as the base, replacing only what the user changed.

Always set:
```yaml
formId: "[chosen formId]"
phoneId: "[chosen phoneId]"
metaTitle: "[chosen meta title]"
metaDescription: "[chosen meta description]"
heroHeadline: "[chosen headline]"
```

**Apply the primary focus keyword throughout:**
- **H1 / heroHeadline** — must contain the exact focus keyword
- **H2 headings** (split block headlines) — keyword or a close semantic variant
- **Meta title** — keyword near the front
- **Meta description** — keyword naturally in the first sentence
- **Image alt tags** — keyword or semantically related terms
- **Body copy** — sprinkle naturally, do not keyword-stuff

Never leave any `[placeholder]` text in the final file.

---

## Step 4 — Build & Validate

```bash
npm run build
```
- ✅ Passes → commit and report
- ❌ Fails → fix the error, retry

---

## Step 5 — Commit & Push

```bash
git add -A
git commit -m "feat: add [new-slug] page (formId: [chosen], phoneId: [chosen])"
git push origin main
```

---

## Report to User

```
✅ Page created: /[new-slug]

Mode:     [Fresh / Duplicated from: source-slug]
formId:   [chosen]
phoneId:  [chosen]
Keyword:  [focus keyword]
Template: [page type]

Build: [X] pages ✅ | Pushed to main
```
