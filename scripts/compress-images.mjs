/**
 * compress-images.mjs
 * Converts all JPG/PNG assets to WebP and creates resized versions.
 * Hero/bg images: max 1600px wide, quality 78
 * Team/portrait photos: max 900px wide, quality 80
 * Logos/icons: max 600px wide, quality 85 (lossless for PNG logos)
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const ASSETS_DIR = './public/_assets';

const rules = [
  // Hero / full-bleed backgrounds
  { match: ['TechsInstallers-04', 'OWA Vans', 'OWA box truck', 'Work Vehicle', 'truck photo', 'Van Photo'], width: 1600, quality: 78 },
  // Team portraits
  { match: ['team1', 'team2', 'team10', 'team13', 'team14', 'team15', 'UHeR7q3o', 'Jeff1', 'team3'], width: 900, quality: 80 },
  // Logos/icons — keep crisp
  { match: ['logo', 'Logo', 'OWALogo', 'google-g'], width: 600, quality: 90 },
  // Tech cutout
  { match: ['tech cutout'], width: 900, quality: 82 },
  // Fallback
];

function getRule(filename) {
  for (const rule of rules) {
    if (rule.match.some(m => filename.includes(m))) return rule;
  }
  return { width: 1200, quality: 80 }; // default
}

const files = await readdir(ASSETS_DIR);
const images = files.filter(f => /\.(jpe?g|png)$/i.test(f) && !f.includes('one_way_air_logo'));

let totalBefore = 0;
let totalAfter = 0;

for (const file of images) {
  const inputPath = join(ASSETS_DIR, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const outputPath = join(ASSETS_DIR, outputName);

  const { size: before } = await stat(inputPath);
  totalBefore += before;

  const rule = getRule(file);

  try {
    const info = await sharp(inputPath)
      .resize({ width: rule.width, withoutEnlargement: true })
      .webp({ quality: rule.quality })
      .toFile(outputPath);

    totalAfter += info.size;
    const pct = Math.round((1 - info.size / before) * 100);
    console.log(`✓ ${file} → ${outputName} | ${(before/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB (${pct}% smaller)`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\n📦 Total: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (${Math.round((1 - totalAfter/totalBefore)*100)}% reduction)`);
