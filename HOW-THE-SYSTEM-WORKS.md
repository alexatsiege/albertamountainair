# Anti Gravity — How the System Works

A high-level overview of the website architecture and the directory of AI skills.

---

## How Do You Want to Work?

**Using an AI agent (recommended):**
The fastest and most reliable way. The AI asks you every required question and generates the page for you.

| Task | Skill to use |
|------|--------------|
| Build a completely new website repository | `docs/skills/build-new-site.md` |
| Create a new page | `docs/skills/create-new-page.md` |
| Duplicate an existing page | `docs/skills/create-new-page.md` |
| **Export** a component/layout to v2 template | `docs/skills/page-export-import.md` |
| **Import** a component/layout from v2 template | `docs/skills/import-from-v2.md` |

### 📚 The "Library" Concept (Importing vs Exporting)
Think of the V2 Template as your central **Library of generic blueprints**. 
* **The Exporter (`page-export-import.md`):** Rips a cool component out of a specific client's site, strips away all their specific logos, colors, and tracking IDs, and saves it into the Library as a clean, generic blueprint.
* **The Importer (`import-from-v2.md`):** Pulls a generic blueprint out of the Library into a specific client's site and automatically injects their specific colors, tracking IDs, and locations. 

Example prompts:
```text
I need to spin up a new repository for Smith Plumbing. Follow docs/skills/build-new-site.md
I need a new page for [Client Name]. Follow the create-new-page skill at docs/skills/create-new-page.md
Import the QualifyForm component from the v2 template. Follow docs/skills/import-from-v2.md
```

**Doing it manually (Not Recommended for Full Sites):**
Follow the step-by-step guide below. Use the `_templates/` folder as your starting point for new pages.

---

## How the System Works

Every site is controlled by **two files** per client:

| File | What it controls |
|---|---|
| `src/content/clients/CLIENT.yaml` | Business info, colors, phone, images, service areas |
| `src/content/pages/CLIENT--PAGE.md` | All text on every page (headlines, body copy, FAQs) |

You drop images into `public/_assets/` and reference them by filename.  
Run `./publish.sh` and everything goes live.

---

## Step 1 — Create the Client Config

**Duplicate the template:**
```
src/content/clients/jay-moody-hvac.yaml  →  src/content/clients/new-client-slug.yaml
```

**Fill in the client's details:**
```yaml
businessName: "Smith Plumbing"
phone: "(555) 123-4567"
address: "100 Main St"
city: "Austin"
state: "TX"
zip: "78701"
email: "info@smithplumbing.com"
siteUrl: "https://smithplumbing.com"

navCTA: "Get a Free Quote"

colorPrimary: "#1E40AF"       # Client's main brand color (hex)
colorPrimaryDark: "#1D4ED8"   # Slightly darker version
colorAccent: "#F59E0B"        # Button/highlight color

googleRating: 4.9
googleReviewCount: 180

serviceAreas:
  - "Austin"
  - "Round Rock"
  - "Cedar Park"

services:
  - name: "Drain Cleaning"
    slug: "drain-cleaning-austin"
  - name: "Water Heater Repair"
    slug: "water-heater-repair"

truckSrc: "/_assets/smith-truck.png"
techCutout: "/_assets/smith-tech-cutout.webp"
mapEmbedUrl: "https://www.google.com/maps/embed?pb=..."
```

---

## Step 2 — Upload Client Images

Drop images into:
```
public/_assets/
```

**Required images (rename to match what you put in the YAML):**
- Client logo
- Hero background photo (`hero-bg.jpg` style)
- Technician transparent cutout (`.webp` or `.png` with no background)
- Truck photo (for CTA + service area animations)

No code changes needed — the image paths in the YAML auto-connect to every module.

---

## Step 3 — Create the Page Files

**Duplicate the template pages:**
```
src/content/pages/jay-moody-hvac--home.md  →  src/content/pages/new-client--home.md
src/content/pages/jay-moody-hvac--about.md →  src/content/pages/new-client--about.md
```
(Replace `new-client` with the same slug used in Step 1)

**Edit the text in each file:**
```yaml
---
template: home    # controls which modules appear (see below)

metaTitle: "Austin's Best Plumber | Smith Plumbing"
metaDescription: "Fast, reliable plumbing in Austin..."

heroHeadline: "Austin's Most Trusted Plumber"
heroSubheadline: "Same-day service, upfront pricing."
heroBullets:
  - "Same-day emergency service"
  - "Licensed & insured"

split:
  - eyebrow: "Why Choose Us"
    headline: "30 Years of Trust"
    body: "Smith Plumbing has served Austin since 1994..."
    image: "/_assets/smith-truck.png"

faq:
  - q: "Do you offer emergency service?"
    a: "Yes — 24/7, including weekends."
---
```

---

## Page Templates — Which Modules Show

The `template:` field controls which sections appear on the page:

| Template | Sections shown |
|---|---|
| `home` | Hero → Services Grid → 50/50 Sections → Reviews → Service Area → CTA |
| `service` | Hero → 50/50 Section → Reviews → FAQ → CTA |
| `location` | Hero → Services Grid → 50/50 Section → Service Area → CTA |
| `about` | Hero → 50/50 Section → FAQ → CTA |

The design of each section (colors, layout, animations) is **automatic** — it reads `colorPrimary`, images, and other values from the client YAML.

---

## Step 4 — Publish

```bash
cd "Website Builder Astro"
./publish.sh
```

That's it. The site builds and deploys to Vercel in ~30 seconds.

**Other useful commands:**
```bash
./publish.sh --preview    # Get a preview URL without touching production
./publish.sh --build-only # Test the build locally without deploying
```

---

## Updating an Existing Site

| What to change | Where to change it |
|---|---|
| Phone number, colors, services | `src/content/clients/CLIENT.yaml` |
| Page text, headlines, FAQs | `src/content/pages/CLIENT--PAGE.md` |
| Images | Replace the file in `public/_assets/` (keep same filename) |
| Add a new page | Use the AI skill at `docs/skills/create-new-page.md` — or duplicate a `.md` file from `_templates/` and fill in `formId` + `phoneId` from `src/content/formRegistry.ts` |

After any change → `./publish.sh` → live in 30 seconds.

---

## File & Folder Map

```
Website Builder Astro/
├── src/
│   ├── content/
│   │   ├── clients/           ← ONE YAML FILE PER CLIENT
│   │   │   └── jay-moody-hvac.yaml
│   │   └── pages/             ← ONE MD FILE PER PAGE
│   │       ├── jay-moody-hvac--home.md
│   │       ├── jay-moody-hvac--about.md
│   │       └── jay-moody-hvac--heat-pump-installation-leominster.md
│   └── components/            ← Design lives here (don't touch unless redesigning)
│       ├── Header.astro
│       ├── HeroTrust.astro
│       ├── ServicesGrid.astro
│       ├── FiftyFifty.astro
│       ├── Reviews.astro
│       ├── ServiceArea.astro
│       ├── CTA.astro
│       └── Footer.astro
├── public/
│   └── _assets/               ← ALL IMAGES GO HERE
└── publish.sh                 ← RUN THIS TO DEPLOY
```
