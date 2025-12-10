import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const product = {
    "id": 1,
    "brand": "Dior",
    "name": "Sauvage",
    "segment": "Designer",
    "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dior+Sauvage\""
};

async function runDebugScraper() {
    console.log('🚀 Starting DEBUG Scraper...');
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    try {
        const query = `${product.brand} ${product.name} fiyat site:sephora.com.tr`;
        const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

        console.log(`Navigating to: ${ddgUrl}`);
        await page.goto(ddgUrl, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 2000));

        const firstResult = await page.evaluate(() => {
            const anchor = document.querySelector('.result__a');
            return anchor ? anchor.href : null;
        });

        if (firstResult) {
            console.log(`🔗 Found URL: ${firstResult}`);
            await page.goto(firstResult, { waitUntil: 'networkidle2' });

            console.log('Waiting for content to load...');
            await new Promise(r => setTimeout(r, 5000)); // Wait for dynamic content

            const content = await page.content();
            fs.writeFileSync(path.join(__dirname, 'debug.html'), content);
            console.log('💾 Saved debug.html');
        } else {
            console.log('❌ No search result found.');
        }

    } catch (e) {
        console.error(`❌ Error: ${e.message}`);
    }

    await browser.close();
}

runDebugScraper();
