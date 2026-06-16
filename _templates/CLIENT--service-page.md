---
# ══════════════════════════════════════════
# SERVICE PAGE TEMPLATE
# Use for: specific service pages
# e.g. furnace-repair-austin, heat-pump-installation-leominster
# Copy → rename → src/content/pages/CLIENT--page-slug.md
# ══════════════════════════════════════════
template: service
schema: ["HVACBusiness", "Service", "FAQPage"]

metaTitle: "[Service Name] in [City], [State] | Business Name"
metaDescription: "[Service] in [City]. Same-day service, all brands, upfront pricing. Call Business Name — we fix it right the first time."
formId: "CHOOSE-FORM-ID"    # Required — see formRegistry.ts for valid options
phoneId: "CHOOSE-PHONE-ID"  # Required — see formRegistry.ts for valid options

heroTemplate: trust
heroHeadline: "[Service Name] in [City], [State]"
heroSubheadline: "Fast, reliable [service] from certified technicians — same-day service available."
heroBullets:
  - "Same-day service available"
  - "All brands serviced"
  - "Upfront pricing"
  - "Warrantied parts & labor"

split:
  - eyebrow: "[Short Hook]"
    headline: "[Strong Benefit Headline]"
    body: "[2-3 sentences explaining the service, who it's for, and why customers trust you for it.]"

faq:
  - q: "How much does [service] cost?"
    a: "[Price range or how pricing works. Always mention free estimates.]"
  - q: "How quickly can you [respond/fix/install]?"
    a: "[Turnaround time, same-day options, etc.]"
  - q: "Do you offer emergency [service]?"
    a: "[Yes/No + details on hours and availability.]"
---
