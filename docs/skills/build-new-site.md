# Skill: Build a New Client Website

**Description:** This is the master Standard Operating Procedure (SOP) for spinning up a brand new website repository for a new client. It orchestrates the infrastructure scripts, client data intake, and page generation skills in the correct order.

## Phase 1: Infrastructure Provisioning
1. **Execute the Script:** Open the terminal in the root of the master workspace and run the new client script on the V2 template:
   ```bash
   cd v2-astro-builder-website-template
   ./new-client.sh <client-slug>
   ```
   *(Example: `./new-client.sh smith-plumbing`)*
2. **Navigate:** Once complete, move your terminal and workspace focus entirely into the newly created folder (e.g., `cd ../smith-plumbing-astro`).

## Phase 2: The Client Intake
Before writing any code or generating pages, the AI must ask the user for the following required baseline data:
- **Business Name:** (e.g., Smith Plumbing & Air)
- **Primary Domain/Site URL:**
- **Brand Colors:** (Primary Hex, Dark Hex, Accent Hex)
- **Primary Phone Number:** (This will be registered as the master fallback)
- **Physical Address & Google Rating/Review Count:**
- **Service Areas:** (List the top 3-5 cities they service)

*Once the user provides this, the AI must update `src/content/clients/<client-slug>.yaml` with these exact values.*

## Phase 3: Asset Population
The AI must instruct the user to drop the following mandatory images into the `public/_assets/` folder, ensuring the filenames match what is defined in the YAML file:
1. Client Logo (`logo.png` or `logo.webp`)
2. Hero Background Image (high quality, usually 1920x1080)
3. Technician Cutout (transparent `.webp` or `.png` for the CTA blocks)

## Phase 4: Form & Phone Registry Setup
Because we enforce strict lead tracking:
1. The AI must create or update `src/content/formRegistry.ts` (or equivalent registry file if moved).
2. Register the new client's primary form ID (e.g., `contact-form-smith-main`).
3. Register the new client's primary phone ID.

## Phase 5: Core Page Generation
With the foundation laid, the AI must now generate the core pages by strictly following the `docs/skills/create-new-page.md` skill.
1. Generate the **Home Page**.
2. Generate the **About Page**.
3. Generate the **Primary Service Page** (e.g., AC Repair).

## Phase 6: Final QA & Deployment
1. **Local Test:** The AI must instruct the user to run `npm run dev` to verify that global brand colors, nested routes, and the "Air Rush" transitions are functioning correctly.
2. **Git Commit:** Run `git add .` and `git commit -m "feat: initial site build for <client-slug>"`
3. **Publish:** Push to the remote repository so Netlify/Vercel can deploy the live site.
