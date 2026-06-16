---
# ═══════════════════════════════════════
# HOME PAGE TEMPLATE
# Copy this file and rename it:
#   src/content/pages/YOUR-CLIENT--home.md
# ═══════════════════════════════════════

template: home
schema: ["HVACBusiness", "WebPage", "AggregateRating", "FAQPage"]

# ── SEO ──────────────────────────────────────────────────
metaTitle: "City's Most Trusted [Trade] Experts | Business Name"
metaDescription: "Business Name serves City and surrounding areas with same-day service. Licensed, insured, and 5-star rated. Call for a free quote."
formId: "CHOOSE-FORM-ID"    # Required — see formRegistry.ts for valid options
phoneId: "CHOOSE-PHONE-ID"  # Required — see formRegistry.ts for valid options

# ── Hero ─────────────────────────────────────────────────
heroTemplate: trust
heroHeadline: "City's Most Trusted [Trade] Experts"
heroSubheadline: "Keeping your family comfortable year-round. Fast response, upfront pricing, and work you can count on."
heroBullets:
  - "Same-day emergency service"
  - "Upfront pricing, no surprises"
  - "100% satisfaction guaranteed"
  - "Licensed & insured"

# ── 50/50 Sections (up to 3) ─────────────────────────────
split:
  - eyebrow: "Why Choose Us"
    headline: "A Family Business Built on Trust"
    body: "We've been serving the community since [YEAR]. As a family-owned company, we treat every home like our own — with honest advice, fair pricing, and work that lasts."
    image: "/_assets/TRUCK-IMAGE.png"
  - eyebrow: "How It Works"
    headline: "Simple Process, Zero Stress"
    body: "Getting your [service] repaired or replaced shouldn't be a headache. Our streamlined process means you go from 'something's wrong' to 'problem solved' as fast as possible."
    image: "/_assets/TEAM-IMAGE.jpg"
  - eyebrow: "New Equipment"
    headline: "High-Efficiency Systems, Expert Installation"
    body: "Ready to upgrade? We install all major brands with precision and care, and back every job with our satisfaction guarantee."
    image: "/_assets/TECH-CUTOUT.webp"

# ── FAQ ──────────────────────────────────────────────────
faq:
  - q: "How quickly can you respond?"
    a: "We offer same-day emergency service 7 days a week."
  - q: "Do you charge for estimates?"
    a: "No — all estimates are completely free with zero obligation."
  - q: "What areas do you serve?"
    a: "We serve [City], [City 2], [City 3], and surrounding communities."
  - q: "Are you licensed and insured?"
    a: "Yes. We are fully licensed, bonded, and insured for your protection."
---
