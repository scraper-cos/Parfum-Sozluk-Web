import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { originals } from './src/data/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin initialization
let db;
try {
    // Try to load service account key
    const serviceAccount = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'firebase-service-account.json'), 'utf8')
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    console.log('✅ Firebase Admin initialized');
} catch (error) {
    console.error('⚠️ Firebase Admin initialization failed:', error.message);
    console.log('📝 Will save to local JSON file instead');
}

const products = originals;
const IGNORE_TERMS = ["Set", "Deodorant", "Vücut Losyonu", "Duş Jeli", "Hair Mist", "After Shave", "Sprey", "Lotion", "Cream", "Soap", "Refill", "Yedek", "Seyahat"];

// Reliability checker
function checkReliability(volume, normalizedPrice, originalPrice) {
    const checks = {
        reliable: true,
        reasons: []
    };

    // Check 1: Volume too small
    if (volume < 30) {
        checks.reliable = false;
        checks.reasons.push('small_volume');
    }

    // Check 2: Volume too large (likely a set)
    if (volume > 200) {
        checks.reliable = false;
        checks.reasons.push('large_volume_set');
    }

    // Check 3: Normalized price too high
    if (normalizedPrice > 50000) {
        checks.reliable = false;
        checks.reasons.push('high_normalized_price');
    }

    // Check 4: Normalized price too low (suspiciously cheap)
    if (normalizedPrice < 1000) {
        checks.reliable = false;
        checks.reasons.push('low_normalized_price');
    }

    // Check 5: Original price seems off
    if (originalPrice > 100000) {
        checks.reliable = false;
        checks.reasons.push('high_original_price');
    }

    return checks;
}

async function saveToFirebase(productId, priceData, needsReview = false) {
    if (!db) {
        console.log('⚠️ Firebase not available, skipping save');
        return false;
    }

    try {
        const collection = needsReview ? 'pricesNeedsReview' : 'prices';
        const docRef = db.collection(collection).doc(productId.toString());

        await docRef.set({
            ...priceData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`✅ Saved to Firebase (${collection}): Product ID ${productId}`);
        return true;
    } catch (error) {
        console.error(`❌ Firebase save error for product ${productId}:`, error.message);
        return false;
    }
}

async function runScraper() {
    console.log('🚀 Starting Price Scraper (Firebase Mode)...');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Local backup
    const localBackupPath = path.join(__dirname, 'prices-backup.json');
    let scrapedData = [];

    // Load existing local backup
    if (fs.existsSync(localBackupPath)) {
        try {
            scrapedData = JSON.parse(fs.readFileSync(localBackupPath, 'utf8'));
        } catch (e) {
            console.log('⚠️ Could not parse backup, starting fresh.');
        }
    }

    const scrapedIds = new Set(scrapedData.map(p => p.id));
    const productsToScrape = products.filter(p => !scrapedIds.has(p.id));

    console.log(`📊 Total Products: ${products.length}`);
    console.log(`✅ Already Scraped: ${scrapedIds.size}`);
    console.log(`⏳ Remaining: ${productsToScrape.length}`);

    let stats = {
        total: productsToScrape.length,
        reliable: 0,
        needsReview: 0,
        failed: 0
    };

    for (const product of productsToScrape) {
        console.log(`\n🔍 Processing (${product.id}): ${product.brand} - ${product.name}`);

        try {
            // 1. Search on DuckDuckGo
            const query = `${product.brand} ${product.name} fiyat site:sephora.com.tr`;
            const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

            await page.goto(ddgUrl, { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

            const firstResult = await page.evaluate(() => {
                const anchor = document.querySelector('.result__a');
                return anchor ? anchor.href : null;
            });

            if (!firstResult) {
                console.log('❌ No search result found.');
                stats.failed++;
                continue;
            }

            console.log(`🔗 Found URL: ${firstResult}`);

            // 2. Visit Product Page
            await page.goto(firstResult, { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));

            const title = await page.title();
            const content = await page.content();

            // 3. Filter (Ignore Terms)
            const hasIgnoreTerm = IGNORE_TERMS.some(term => title.toLowerCase().includes(term.toLowerCase()));
            if (hasIgnoreTerm) {
                console.log(`⚠️ Ignored due to term in title: "${title}"`);
                stats.failed++;
                continue;
            }

            // 4. Extract Price & Volume
            try {
                await page.waitForSelector('.price-sales-standard, .variation-title', { timeout: 5000 });
            } catch (e) {
                console.log('⚠️ Price element wait timed out...');
            }

            const priceText = await page.evaluate(() => {
                const el = document.querySelector('.price-sales-standard') || document.querySelector('.variation-title');
                return el ? el.innerText : '';
            });

            const textToSearch = priceText || content;
            const priceMatch = textToSearch.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);

            let volumeMatch = title.match(/(\d+)\s?(ml|ML|Ml)/);

            if (!volumeMatch) {
                const volumeText = await page.evaluate(() => {
                    const selectedVar = document.querySelector('.variation-option.is-selected');
                    if (selectedVar) return selectedVar.innerText;

                    const varBtn = document.querySelector('.variation-button');
                    if (varBtn) return varBtn.getAttribute('title') || varBtn.innerText;

                    const pageTitle = document.querySelector('.product-name');
                    if (pageTitle) return pageTitle.innerText;

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

                console.log(`📦 Data Extracted: ${price} TL / ${volume}ml → ${normalizedPrice.toFixed(2)} TL (100ml)`);

                // Check reliability
                const reliabilityCheck = checkReliability(volume, normalizedPrice, price);

                const priceData = {
                    productId: product.id,
                    price: parseFloat(normalizedPrice.toFixed(2)),
                    originalPrice: price,
                    originalVolume: volume,
                    productUrl: firstResult,
                    source: 'scraped',
                    reliable: reliabilityCheck.reliable,
                    scrapedAt: new Date().toISOString()
                };

                if (!reliabilityCheck.reliable) {
                    priceData.reasons = reliabilityCheck.reasons;
                    console.log(`⚠️ NEEDS REVIEW: ${reliabilityCheck.reasons.join(', ')}`);
                    stats.needsReview++;

                    // Save to needsReview collection
                    await saveToFirebase(product.id, priceData, true);
                } else {
                    console.log(`✅ RELIABLE - Auto-approved`);
                    stats.reliable++;

                    // Save to prices collection
                    await saveToFirebase(product.id, priceData, false);
                }

                // Also save to local backup
                scrapedData.push({
                    id: product.id,
                    ...priceData
                });
                fs.writeFileSync(localBackupPath, JSON.stringify(scrapedData, null, 2));

            } else {
                console.log('❌ Extraction Failed:');
                if (!priceMatch) console.log(`   - Price not found`);
                if (!volumeMatch) console.log(`   - Volume not found`);
                stats.failed++;
            }

        } catch (e) {
            console.error(`❌ Error: ${e.message}`);
            stats.failed++;
        }
    }

    console.log(`\n📊 SCRAPING COMPLETE`);
    console.log(`   Total: ${stats.total}`);
    console.log(`   ✅ Reliable: ${stats.reliable}`);
    console.log(`   ⚠️ Needs Review: ${stats.needsReview}`);
    console.log(`   ❌ Failed: ${stats.failed}`);
    console.log(`\n💾 Local backup saved to: ${localBackupPath}`);

    await browser.close();
}

runScraper().catch(console.error);
