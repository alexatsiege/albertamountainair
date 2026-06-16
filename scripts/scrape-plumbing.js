// Scrape 5 live Unbounce pages for h1, subhead, p, and images
import { load } from 'cheerio';

const urls = [
  'https://book.americanhomepros.com/plumber-near-me/',
  'https://book.americanhomepros.com/sewer-repair-cleaning-services/',
  'https://book.americanhomepros.com/plumbers-broken-arrow/',
  'https://book.americanhomepros.com/24-7-emergency-plumbing-repair/',
  'https://book.americanhomepros.com/plumber-tulsa/'
];

async function scrape(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" } });
    if (!res.ok) { console.error(`Error ${res.status} for ${url}`); return; }
    const html = await res.text();
    const $ = load(html);
    
    console.log(`\n\n--- RESULTS FOR ${url} ---`);
    console.log('H1:', $('h1').first().text().trim().replace(/\s+/g, ' '));
    console.log('H2s:', $('h2').slice(0,3).map((i,el)=>$(el).text().trim().replace(/\s+/g, ' ')).get().join(' | '));
    console.log('Main P:', $('p').first().text().trim().replace(/\s+/g, ' '));
    const imgs = $('img').map((i,el)=>$(el).attr('src')).get().filter(s=>s && s.includes('wp-content/uploads')).slice(0,3);
    console.log('Images:', imgs.join(' , '));
  } catch (err) {
    console.log('Failed', url, err.message);
  }
}

async function run() {
  for (const url of urls) { await scrape(url); }
}
run();
