/**
 * fetch-reviews.js — Alberta Mountain Air
 * Fetches Google Reviews from configured Google Place IDs and writes them
 * into the Alberta Mountain Air client YAML before build.
 *
 * Requires:
 * - GOOGLE_PLACES_API_KEY
 * - valid `placeId` values under `locations` in healthy-air-hvac.yaml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const yamlPath = path.join(__dirname, '../src/content/clients/healthy-air-hvac.yaml');

function loadClientConfig() {
  return yaml.load(fs.readFileSync(yamlPath, 'utf8'));
}

function getConfiguredLocations(doc) {
  return (doc.locations || [])
    .filter(location => location.placeId && location.placeId !== 'REPLACE_WITH_PLACE_ID')
    .map(location => ({
      name: location.name,
      placeId: location.placeId,
    }));
}

async function fetchPlaceReviews(placeId, locationName) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.result?.rating) {
    console.warn(`⚠️  No review data for ${locationName} (${placeId})`);
    return { rating: null, count: null, reviews: [] };
  }

  const reviews = (data.result.reviews || [])
    .filter(review => review.rating >= 4)
    .map(review => ({
      text: review.text,
      name: review.author_name,
      rating: review.rating,
      date: review.relative_time_description || 'Recently',
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

  const doc = loadClientConfig();
  const locations = getConfiguredLocations(doc);

  if (locations.length === 0) {
    console.log('ℹ️  No valid Place IDs configured in healthy-air-hvac.yaml — skipping review fetch.');
    return;
  }

  console.log(`🔄 Fetching live Google Reviews for ${doc.businessName}...`);

  try {
    const results = await Promise.all(
      locations.map(location => fetchPlaceReviews(location.placeId, location.name))
    );

    const allReviews = results.flatMap(result => result.reviews);
    const seen = new Set();
    const dedupedReviews = allReviews.filter(review => {
      const key = `${review.name}:${review.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);

    const validResults = results.filter(result => result.rating !== null);
    const avgRating = validResults.length > 0
      ? Math.round((validResults.reduce((sum, result) => sum + result.rating, 0) / validResults.length) * 10) / 10
      : doc.googleRating || 4.9;
    const totalCount = validResults.reduce((sum, result) => sum + (result.count || 0), 0);

    doc.googleRating = avgRating;
    doc.googleReviewCount = totalCount;

    if (dedupedReviews.length > 0) {
      doc.googleReviews = dedupedReviews;
    }

    fs.writeFileSync(yamlPath, yaml.dump(doc, { lineWidth: -1 }));
    console.log(`✅ Updated healthy-air-hvac.yaml — ${avgRating}★ across ${totalCount} total reviews`);
  } catch (err) {
    console.error('❌ Error fetching Google Reviews:', err);
    process.exit(0);
  }
}

fetchAllReviews();
