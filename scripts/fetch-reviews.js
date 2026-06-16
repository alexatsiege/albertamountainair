/**
 * fetch-reviews.js — One Way Air
 * Fetches Google Reviews from all 4 GMB listings via Google Places API.
 * Skips gracefully if GOOGLE_PLACES_API_KEY is not set (dev / local builds).
 * 
 * Place IDs: Set these once you have them from the GMB console.
 * Find yours at: https://developers.google.com/maps/documentation/places/web-service/place-id
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// ── One Way Air Place IDs ──────────────────────────────────
// Replace REPLACE_WITH_PLACE_ID with real Place IDs from GMB
const LOCATIONS = [
  { name: 'Fort Myers',    placeId: process.env.OWA_PLACE_ID_FORT_MYERS    || 'REPLACE_WITH_PLACE_ID' },
  { name: 'Lehigh Acres',  placeId: process.env.OWA_PLACE_ID_LEHIGH_ACRES  || 'REPLACE_WITH_PLACE_ID' },
  { name: 'Tampa',         placeId: process.env.OWA_PLACE_ID_TAMPA         || 'REPLACE_WITH_PLACE_ID' },
  { name: 'Naples',        placeId: process.env.OWA_PLACE_ID_NAPLES        || 'REPLACE_WITH_PLACE_ID' },
];

async function fetchPlaceReviews(placeId, locationName) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.result?.rating) {
    console.warn(`⚠️  No data for ${locationName} (${placeId})`);
    return { rating: null, count: null, reviews: [] };
  }

  const reviews = (data.result.reviews || [])
    .filter(r => r.rating >= 4)
    .map(r => ({
      text: r.text,
      name: r.author_name,
      rating: r.rating,
      date: r.relative_time_description || 'Recently',
    }));

  console.log(`✅ ${locationName}: ${data.result.rating}★ (${data.result.user_ratings_total} reviews)`);
  return {
    rating: data.result.rating,
    count: data.result.user_ratings_total,
    reviews,
  };
}

async function fetchAllReviews() {
  if (!API_KEY) {
    console.log('ℹ️  GOOGLE_PLACES_API_KEY not set — skipping review fetch. Using existing YAML data.');
    return;
  }

  const hasPlaceIds = LOCATIONS.some(l => l.placeId !== 'REPLACE_WITH_PLACE_ID');
  if (!hasPlaceIds) {
    console.log('ℹ️  No Place IDs configured yet — skipping review fetch.');
    return;
  }

  console.log('🔄 Fetching live Google Reviews from all One Way Air locations…');

  try {
    const results = await Promise.all(
      LOCATIONS
        .filter(l => l.placeId !== 'REPLACE_WITH_PLACE_ID')
        .map(l => fetchPlaceReviews(l.placeId, l.name))
    );

    // Merge all reviews, deduplicate by name
    const allReviews = results.flatMap(r => r.reviews);
    const seen = new Set();
    const dedupedReviews = allReviews.filter(r => {
      if (seen.has(r.name)) return false;
      seen.add(r.name);
      return true;
    }).slice(0, 10); // Keep top 10

    // Calculate overall weighted rating
    const validResults = results.filter(r => r.rating !== null);
    const avgRating = validResults.length > 0
      ? Math.round((validResults.reduce((s, r) => s + r.rating, 0) / validResults.length) * 10) / 10
      : 4.9;
    const totalCount = validResults.reduce((s, r) => s + (r.count || 0), 0);

    // Update YAML
    const yamlPath = path.join(__dirname, '../src/content/clients/one-way-air.yaml');
    let doc = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

    doc.googleRating = avgRating;
    doc.googleReviewCount = totalCount;
    if (dedupedReviews.length > 0) {
      doc.googleReviews = dedupedReviews;
    }

    fs.writeFileSync(yamlPath, yaml.dump(doc, { lineWidth: -1 }));
    console.log(`✅ Updated one-way-air.yaml — ${avgRating}★ across ${totalCount} total reviews`);

  } catch (err) {
    console.error('❌ Error fetching Google Reviews:', err);
    process.exit(0); // Don't fail the build on review fetch errors
  }
}

fetchAllReviews();
