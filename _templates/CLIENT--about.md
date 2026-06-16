---
# ══════════════════════════════════════════
# ABOUT US PAGE TEMPLATE
# Copy → rename → src/content/pages/CLIENT--about.md
# ══════════════════════════════════════════
template: about
schema: ["HVACBusiness", "Service", "FAQPage"]

metaTitle: "About [Business Name] | [City]'s Local [Trade] Experts"
metaDescription: "Learn about [Business Name] — a family-owned [trade] company serving [City] since [YEAR]. Honest service, fair pricing, 5-star rated."
formId: "CHOOSE-FORM-ID"    # Required — see formRegistry.ts for valid options
phoneId: "CHOOSE-PHONE-ID"  # Required — see formRegistry.ts for valid options

heroTemplate: trust
heroHeadline: "About [Business Name]"
heroSubheadline: "Over X years of honest, reliable [trade] service in [Region]."
heroBullets:
  - "Family-owned since [YEAR]"
  - "Fully licensed & insured"
  - "[X]+ satisfied customers"
  - "5-star rated on Google"

split:
  - eyebrow: "Our Story"
    headline: "Who We Are"
    body: "Founded by [Owner Name] in [YEAR], [Business Name] was built on a simple belief: treat every customer like a neighbor. We're not a big company — we're your local [trade] team, and we stand behind every job we do."

faq:
  - q: "How long have you been in business?"
    a: "[Business Name] has been serving [City] since [YEAR] — over X years of trusted service."
  - q: "Do you work on all brands?"
    a: "Yes — we service and install all major brands including [Brand 1], [Brand 2], [Brand 3]."
  - q: "Are your technicians background-checked?"
    a: "Yes — all of our technicians are background-checked, licensed, and factory-trained."
---
