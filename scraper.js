import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { originals } from './src/data/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = originals;

const IGNORE_TERMS = ["Set", "Deodorant", "Vücut Losyonu", "Duş Jeli", "Hair Mist", "After Shave", "Sprey", "Lotion", "Cream", "Soap", "Refill", "Yedek", "Seyahat"];

async function runScraper() {
    console.log('🚀 Starting Price Scraper (Local Mode)...');
    // Launch in non-headless mode so the user can see/interact
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();

    // Set User Agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const pricesPath = path.join(__dirname, 'prices.json');
    let scrapedData = [];
    if (fs.existsSync(pricesPath)) {
        try {
            scrapedData = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
        } catch (e) {
            console.log('⚠️ Could not parse existing prices.json, starting fresh.');
        }
    }

    // Filter out already scraped products to allow resuming
    const scrapedIds = new Set(scrapedData.map(p => p.id));
    const productsToScrape = products.filter(p => !scrapedIds.has(p.id));

    console.log(`📊 Total Products: ${products.length}`);
    console.log(`✅ Already Scraped: ${scrapedIds.size}`);
    console.log(`⏳ Remaining: ${productsToScrape.length}`);

    for (const product of productsToScrape) {
        console.log(`\n🔍 Processing (${product.id}): ${product.brand} - ${product.name}`);

        try {
            // 1. Search on DuckDuckGo
            const query = `${product.brand} ${product.name} fiyat site:sephora.com.tr`;
            const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

            await page.goto(ddgUrl, { waitUntil: 'domcontentloaded' });

            // Random delay 1-3 seconds
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

            // Extract first organic result
            const firstResult = await page.evaluate(() => {
                const anchor = document.querySelector('.result__a');
                return anchor ? anchor.href : null;
            });

            if (!firstResult) {
                console.log('❌ No search result found.');
                continue;
            }

            console.log(`🔗 Found URL: ${firstResult}`);

            // 2. Visit Product Page
            await page.goto(firstResult, { waitUntil: 'domcontentloaded' });

            // Random delay 2-4 seconds
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));

            const title = await page.title();
            const content = await page.content();

            // 3. Filter (Ignore Terms)
            const hasIgnoreTerm = IGNORE_TERMS.some(term => title.toLowerCase().includes(term.toLowerCase()));
            if (hasIgnoreTerm) {
                console.log(`⚠️ Ignored due to term in title: "${title}"`);
                continue;
            }

            // 4. Extract Price & Volume
            // Wait for price element to ensure it's loaded
            try {
                await page.waitForSelector('.price-sales-standard, .variation-title', { timeout: 5000 });
            } catch (e) {
                console.log('⚠️ Price element wait timed out, trying regex on content...');
            }

            const priceText = await page.evaluate(() => {
                const el = document.querySelector('.price-sales-standard') || document.querySelector('.variation-title');
                return el ? el.innerText : '';
            });

            // Fallback to content match if selector fails
            const textToSearch = priceText || content;
            const priceMatch = textToSearch.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);

            let volumeMatch = title.match(/(\d+)\s?(ml|ML|Ml)/);

            // Try to extract volume from content if title fails
            if (!volumeMatch) {
                const volumeText = await page.evaluate(() => {
                    // Try variation buttons (selected or first)
                    const selectedVar = document.querySelector('.variation-option.is-selected');
                    if (selectedVar) return selectedVar.innerText;

                    const varBtn = document.querySelector('.variation-button');
                    if (varBtn) return varBtn.getAttribute('title') || varBtn.innerText;

                    // Try product title on page
                    const pageTitle = document.querySelector('.product-name');
                    if (pageTitle) return pageTitle.innerText;

                    // Try data attributes
                    const skuItem = document.querySelector('[data-at="sku-item-size"]');
                    if (skuItem) return skuItem.innerText;

                    return '';
                });
                if (volumeText) {
                    volumeMatch = volumeText.match(/(\d+)\s?(ml|ML|Ml)/);
                }
            }

            if (priceMatch && volumeMatch) {
                const rawPrice = priceMatch[1].replace(/\./g, '').replace(',', '.');
                const price = parseFloat(rawPrice);
                const volume = parseInt(volumeMatch[1]);
                const normalizedPrice = (price / volume) * 100;

                console.log(`✅ Data Extracted: ${price} TL / ${volume}ml -> ${normalizedPrice.toFixed(2)} TL (100ml)`);

                // Add to results
                scrapedData.push({
                    id: product.id,
                    price: parseFloat(normalizedPrice.toFixed(2)),
                    originalPrice: price,
                    originalVolume: volume,
                    productUrl: firstResult,
                    timestamp: new Date().toISOString()
                });

                // Save immediately to allow resuming
                fs.writeFileSync(pricesPath, JSON.stringify(scrapedData, null, 2));

            } else {
                console.log('❌ Extraction Failed:');
                if (!priceMatch) console.log(`   - Price not found (Text: "${textToSearch?.substring(0, 50).replace(/\n/g, ' ')}...")`);
                if (!volumeMatch) console.log(`   - Volume not found in Title ("${title}") or Content`);
            }

        } catch (e) {
            console.error(`❌ Error: ${e.message}`);
        }
    }

    console.log(`\n💾 Scraping finished! Data saved to prices.json`);
    await browser.close();
}

runScraper();
