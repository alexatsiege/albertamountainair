import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    sitemap(),
  ],
  // Site URL is set per-client via env or build arg
  site: process.env.SITE_URL || 'https://example.com',
});
