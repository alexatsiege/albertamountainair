---
# ══════════════════════════════════════════
# LOCATION PAGE TEMPLATE
# Use for: city/area-specific pages
# e.g. hvac-services-austin, plumbing-round-rock
# Copy → rename → src/content/pages/CLIENT--city-slug.md
# ══════════════════════════════════════════
template: location
schema: ["HVACBusiness", "LocalBusiness", "FAQPage"]

metaTitle: "[Trade] Services in [City], [State] | Business Name"
metaDescription: "Trusted [trade] in [City], [State]. Same-day service, local technicians, all systems serviced. Call Business Name for a free quote."
formId: "CHOOSE-FORM-ID"    # Required — see formRegistry.ts for valid options
phoneId: "CHOOSE-PHONE-ID"  # Required — see formRegistry.ts for valid options

heroTemplate: trust
heroHeadline: "[Trade] Services in [City], [State]"
heroSubheadline: "Trusted [trade] for [City] homeowners — fast response, local technicians."
heroBullets:
  - "Same-day service available"
  - "Local [City] team"
  - "All systems serviced"
  - "Free estimates"

split:
  - eyebrow: "Local Experts"
    headline: "[City]'s Trusted [Trade] Team"
    body: "[Business Name] has been serving [City] for over X years. Our local technicians know the area and respond fast — because when your [system] goes out, you can't wait."

faq:
  - q: "Do you service [City] homes?"
    a: "Yes — [City] is one of our primary service areas. We have technicians in the area daily and can often schedule same-day service."
  - q: "How quickly can you get to [City]?"
    a: "We serve [City] regularly and can typically offer same-day or next-day appointments."
---
