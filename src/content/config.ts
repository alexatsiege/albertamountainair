import { defineCollection, z } from 'astro:content';
import { FORM_IDS, PHONE_IDS } from './formRegistry';

// ── Per-page content schema ────────────────────────────────────────
const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // SEO
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogImage: z.string().optional(),
    focusKeyword: z.string().optional(),
    headerVariant: z.enum(['full', 'ppc']).optional(),

    // Hero
    heroHeadline: z.string(),
    heroSubheadline: z.string(),
    heroBullets: z.array(z.string()).optional(),
    heroTemplate: z.enum(['trust', 'form']).default('trust'),
    heroBg: z.string().optional(),
    promoStamp: z.string().optional(),
    couponTitle: z.string().optional(),
    couponExpiry: z.string().optional(),
    cornerSticker: z.string().optional(),
    heroPhoneFirst: z.boolean().optional(),
    heroHideValueBar: z.boolean().optional(),
    // ── Tracking (required on new pages) ─────────────────────────────────
    // formId:  which of the 4 location forms this page uses (see src/content/formRegistry.ts)
    // phoneId: which tracking number appears on all call buttons on this page
    //
    // Calgary pages → formId: contact-form-calgary  phoneId: calgary-main
    formId:  z.enum(FORM_IDS).optional(),
    phoneId: z.enum(PHONE_IDS).optional(),
    // URL location slug — overrides form-derived location for [location]/[service] URL structure.
    // Use when a city page needs its own URL but routes to a hub form.
    // e.g. locationSlug: "calgary" → URL /calgary/ac-repair, form: contact-form-calgary
    locationSlug: z.string().optional(),

    // @deprecated — use formId + phoneId instead. Kept for backwards compatibility.
    phone: z.string().optional(),
    contactLocation: z.string().optional(),

    serviceSlug: z.string().optional(),     // Used for /[location]/[service] URL structure

    // 50/50 Blocks (up to 3)
    split: z.array(z.object({
      eyebrow: z.string().optional(),
      headline: z.string(),
      body: z.string(),
      image: z.string().optional(),
      features: z.array(z.string()).optional(),
    })).optional(),

    // Author & Reviewer for E-E-A-T
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      image: z.string().optional(),
      url: z.string().optional()
    }).optional(),
    reviewer: z.object({
      name: z.string(),
      role: z.string().optional(),
      image: z.string().optional(),
      url: z.string().optional(),
      date: z.string().optional()
    }).optional(),

    // Pricing factors
    pricingHeading: z.string().optional(),
    pricingFactors: z.array(z.object({
      title: z.string(),
      description: z.string(),
      pricePoint: z.enum(['Low', 'Medium', 'High', 'Varies']).optional(),
      exactRange: z.string().optional(),
    })).optional(),

    // Process Timeline
    processHeading: z.string().optional(),
    processSteps: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),

    // Deep-dive Article / 7030 Section
    longFormContent: z.array(z.object({
      type: z.enum(['heading', 'text', 'bullets', 'table', 'image']),
      level: z.union([z.literal(2), z.literal(3)]).optional(),
      text: z.string().optional(),
      items: z.array(z.string()).optional(),
      headers: z.array(z.string()).optional(),
      rows: z.array(z.array(z.string())).optional(),
      src: z.string().optional(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    })).optional(),

    // FAQ
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),

    // Symptoms SEO Module
    symptomsHeading: z.string().optional(),
    symptomsSubheading: z.string().optional(),
    symptoms: z.array(z.object({
      title: z.string(),
      desc: z.string(),
      review: z.object({
        text: z.string(),
        author: z.string()
      }).optional()
    })).optional(),

    // Recent Service Activity Module
    recentActivityHeading: z.string().optional(),
    recentActivity: z.array(z.object({
      serviceType: z.string(),
      location: z.string(),
      zipCode: z.string(),
      timeAgo: z.string()
    })).optional(),


    // Page-level overrides for global sections
    servicesHeading: z.string().optional(),
    reviewsHeading: z.string().optional(),
    ctaHeading: z.string().optional(),
    ctaSubheading: z.string().optional(),
    ctaFormSimple: z.boolean().optional(),
    ctaFormServicePreset: z.string().optional(),
    ctaFormHeadline: z.string().optional(),
    ctaFormFeatures: z.array(z.string()).optional(),

    // Template type controls which modules render
    template: z.enum(['home', 'service', 'location', 'about', 'service-seo', 'quote', 'service-ppc']).default('service'),

    // Schema types for this page
    schema: z.array(z.string()).default(['HVACBusiness', 'WebPage']),

    // Preview URL (live)
    liveUrl: z.string().optional(),

    // Use the multi-step qualification form instead of standard contact form
    qualifyForm: z.boolean().optional(),

    // Show service area map on service pages
    showServiceArea: z.boolean().optional(),

    // Page-level override for service areas
    serviceAreas: z.union([
      z.array(z.string()),
      z.array(z.object({ county: z.string(), towns: z.array(z.string()) }))
    ]).optional(),

    // Exclude specific dealer logos by alt text
    excludeDealerLogos: z.array(z.string()).optional(),
  }),
});

// ── Client-level config schema ─────────────────────────────────────
const clientCollection = defineCollection({
  type: 'data',
  schema: z.object({
    businessName: z.string(),
    tagline: z.string().optional(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    email: z.string().optional(),
    siteUrl: z.string(),
    ogImage: z.string().optional(),

    // Navigation
    navCTA: z.string().default('Get a Free Quote'),
    navCtaUrl: z.string().default('/contact'),

    // Header variant: 'full' = standard nav, 'ppc' = logo + phone + CTA only
    headerVariant: z.enum(['full', 'ppc']).default('ppc'),

    // Footer variant: 'full' = multi-column with links, 'ppc' = minimal bar
    footerVariant: z.enum(['full', 'ppc']).default('ppc'),

    // Brand colors
    colorPrimary: z.string().default('#2563EB'),
    colorPrimaryDark: z.string().default('#1D4ED8'),
    colorAccent: z.string().default('#F59E0B'),
    colorText: z.string().default('#1A1A2E'),

    // Google
    googlePlaceId: z.string().optional(),
    googleRating: z.number().optional(),
    googleReviewCount: z.number().optional(),
    googleReviews: z.array(z.object({
      text: z.string(),
      name: z.string(),
      rating: z.number().optional(),
      date: z.string().optional(),
      photo: z.string().optional()
    })).optional(),

    // Services list (global)
    services: z.array(z.object({
      name: z.string(),
      slug: z.string(),
      tag: z.string().optional(),
    })),

    // Service areas (global)
    serviceAreas: z.union([
      z.array(z.string()),
      z.array(z.object({ county: z.string(), towns: z.array(z.string()) }))
    ]),

    // Social
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),

    // Service area module
    logoSrc: z.string().optional(),
    truckSrc: z.string().optional(),
    techCutout: z.string().optional(),
    mapEmbedUrl: z.string().optional(),
    gtmId: z.string().optional(),
    recaptchaSiteKey: z.string().optional(),

    // Dealer / certification logos
    dealerLogos: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })).optional(),

    // Trust / Association logos (Chamber, BBB, etc.)
    associations: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      link: z.string().optional(),
    })).optional(),


    // Hero floating reviews
    heroReviews: z.array(z.object({
      text: z.string(),
      name: z.string(),
    })).optional(),

    // Global section headings
    servicesEyebrow: z.string().default('What We Do'),
    servicesHeading: z.string().default('Our Services'),
    reviewsHeading: z.string().default('Real Reviews from Real Homeowners'),
    ctaHeading: z.string().default("Don't Wait — We're Ready Now"),
    ctaSubheading: z.string().optional(),

    // Schema
    schemaDescription: z.string().optional(),
    yearFounded: z.number().optional(),
    licenseNumber: z.string().optional(),

    // Extended brand colors (colorPrimaryDark already defined above)
    colorAccentAlt: z.string().optional(),

    // Hero
    heroEyebrow: z.string().optional(),

    // Team members
    team: z.array(z.object({
      name: z.string(),
      role: z.string(),
      blurb: z.string().optional(),
      image: z.string().optional(),
    })).optional(),

    // Locations (for multi-location businesses)
    locations: z.array(z.object({
      name: z.string(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      slug: z.string().optional(),
      placeId: z.string().optional(),
    })).optional(),

    // Company video
    videoSrc: z.string().optional(),
    videoId: z.string().optional(),
    videoEmbedUrl: z.string().optional(),
    videoThumbnail: z.string().optional(),
    videoStats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
  }),
});

export const collections = {
  pages: pageCollection,
  clients: clientCollection,
};
