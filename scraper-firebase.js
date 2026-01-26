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
}

const products = originals;
const IGNORE_TERMS = ["Set", "Deodorant", "Vücut Losyonu", "Duş Jeli", "Hair Mist", "After Shave", "Sprey", "Lotion", "Cream", "Soap", "Refill", "Yedek", "Seyahat", "Maskara", "Ruj", "Fondöten", "Allık"];

function checkReliability(volume, normalizedPrice, originalPrice) {
    const checks = { reliable: true, reasons: [] };

    if (volume < 30) {
        checks.reliable = false;
        checks.reasons.push('small_volume');
    }
    if (volume > 200) {
        checks.reliable = false;
        checks.reasons.push('large_volume_set');
    }
    if (normalizedPrice > 50000) {
        checks.reliable = false;
        checks.reasons.push('high_normalized_price');
    }
    if (normalizedPrice < 1000) {
        checks.reliable = false;
        checks.reasons.push('low_normalized_price');
    }
    if (originalPrice > 100000) {
        checks.reliable = false;
        checks.reasons.push('high_original_price');
    }

    return checks;
}

async function saveToFirebase(productId, priceData, needsReview = false) {
    if (!db) return false;

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

// Helper: normalize text for comparison
function normalize(text) {
    return text.toLowerCase()
        .replace(/&/g, 'and')
        .replace(/'/g, '')
        .replace(/'/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Helper: check if brand name appears in text
function brandMatches(brandName, text) {
    const normalizedBrand = normalize(brandName);
    const normalizedText = normalize(text);

    // Split brand name (e.g., "Tom Ford" -> ["tom", "ford"])
    const brandWords = normalizedBrand.split(' ');

    // Check if all brand words appear in text
    return brandWords.every(word => normalizedText.includes(word));
}

async function scrapeSephora(page, brand, name) {
    try {
        console.log('   🔍 Searching Sephora...');

        const searchUrl = `https://www.sephora.com.tr/search?q=${encodeURIComponent(brand + ' ' + name)}`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));

        // Get ALL product links from search results
        const productLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('a[href*="/p/"]');
            const results = [];
            links.forEach(link => {
                const href = link.href;
                const text = link.innerText || link.textContent || '';
                const title = link.getAttribute('title') || '';
                results.push({
                    url: href,
                    text: text.trim(),
                    title: title.trim()
                });
            });
            return results;
        });

        if (productLinks.length === 0) {
            console.log('   ❌ No products found in search');
            return null;
        }

        console.log(`   📋 Found ${productLinks.length} results, checking for brand match...`);

        // Find first matching product
        let matchedProduct = null;
        for (const link of productLinks) {
            const combined = `${link.url} ${link.text} ${link.title}`;

            // Check if brand appears AND it's a perfume
            const hasBrand = brandMatches(brand, combined);
            const isPerfume = /parfum|fragrance|eau de|cologne|edp|edt/i.test(combined);

            if (hasBrand && isPerfume) {
                matchedProduct = link;
                console.log(`   ✅ Match found: ${link.url.substring(0, 60)}...`);
                break;
            }
        }

        if (!matchedProduct) {
            console.log(`   ❌ No matching perfume for "${brand}" found`);
            return null;
        }

        // Visit the matched product page
        await page.goto(matchedProduct.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));

        const title = await page.title();

        // Double-check brand match on product page
        if (!brandMatches(brand, title)) {
            console.log(`   ⚠️ Brand mismatch on product page: "${title}"`);
            return null;
        }

        // Check ignore terms
        const hasIgnoreTerm = IGNORE_TERMS.some(term => title.toLowerCase().includes(term.toLowerCase()));
        if (hasIgnoreTerm) {
            console.log(`   ⚠️ Ignored (contains: ${IGNORE_TERMS.find(t => title.toLowerCase().includes(t.toLowerCase()))})`);
            return null;
        }

        // Try to select 100ml if available
        const volumes = await page.evaluate(() => {
            const buttons = document.querySelectorAll('.variation-button, .variation-option');
            const found = [];
            buttons.forEach(btn => {
                const text = btn.getAttribute('title') || btn.innerText || '';
                const match = text.match(/(\d+)\s?(ml|ML|Ml)/);
                if (match) found.push(parseInt(match[1]));
            });
            return found;
        });

        let selectedVolume = null;
        if (volumes.includes(100)) {
            console.log('   ✨ 100ml option available, selecting...');
            await page.evaluate(() => {
                const buttons = document.querySelectorAll('.variation-button, .variation-option');
                for (const btn of buttons) {
                    const text = btn.getAttribute('title') || btn.innerText || '';
                    if (text.match(/100\s?(ml|ML|Ml)/)) {
                        btn.click();
                        return;
                    }
                }
            });
            await new Promise(r => setTimeout(r, 1500));
            selectedVolume = 100;
        }

        // Extract price
        const priceText = await page.evaluate(() => {
            const el = document.querySelector('.price-sales-standard') || document.querySelector('.variation-title');
            return el ? el.innerText : '';
        });

        const priceMatch = priceText.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);
        if (!priceMatch) {
            console.log('   ❌ Price not found');
            return null;
        }

        // Extract volume
        let volume = selectedVolume;
        if (!volume) {
            const volumeText = await page.evaluate(() => {
                const sel = document.querySelector('.variation-option.is-selected, .variation-button');
                return sel ? (sel.getAttribute('title') || sel.innerText) : '';
            });
            const volMatch = (volumeText || title).match(/(\d+)\s?(ml|ML|Ml)/);
            if (volMatch) volume = parseInt(volMatch[1]);
        }

        if (!volume) {
            console.log('   ❌ Volume not found');
            return null;
        }

        const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));

        return {
            price,
            volume,
            url: matchedProduct.url,
            source: 'sephora'
        };

    } catch (error) {
        console.log(`   ❌ Sephora error: ${error.message}`);
        return null;
    }
}

async function runScraper() {
    console.log('🚀 Starting Smart Sephora Scraper (WITH BRAND MATCHING)...\n');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Check Firebase
    let firebaseScrapedIds = new Set();
    if (db) {
        try {
            console.log('🔍 Checking Firebase for existing prices...');
            const [pricesSnap, reviewSnap] = await Promise.all([
                db.collection('prices').get(),
                db.collection('pricesNeedsReview').get()
            ]);

            pricesSnap.forEach(doc => firebaseScrapedIds.add(doc.data().productId));
            reviewSnap.forEach(doc => firebaseScrapedIds.add(doc.data().productId));

            console.log(`✅ Found ${firebaseScrapedIds.size} products in Firebase\n`);
        } catch (error) {
            console.log('⚠️ Firebase check failed');
        }
    }

    const productsToScrape = products.filter(p => !firebaseScrapedIds.has(p.id));

    console.log(`📊 Total Products: ${products.length}`);
    console.log(`✅ Already in Firebase: ${firebaseScrapedIds.size}`);
    console.log(`⏳ Need to Scrape: ${productsToScrape.length}\n`);

    if (productsToScrape.length === 0) {
        console.log('🎉 All products already have prices!');
        await browser.close();
        return;
    }

    let stats = {
        total: productsToScrape.length,
        reliable: 0,
        needsReview: 0,
        failed: 0
    };

    const localBackupPath = path.join(__dirname, 'prices-backup.json');
    let scrapedData = [];

    for (const product of productsToScrape) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔍 [${product.id}] ${product.brand} - ${product.name}`);

        try {
            const result = await scrapeSephora(page, product.brand, product.name);

            if (!result) {
                console.log('   ❌ Failed');
                stats.failed++;
                continue;
            }

            // Success!
            const normalizedPrice = (result.price / result.volume) * 100;
            const usedCalc = result.volume === 100 ? 'DIRECT' : 'CALCULATED';

            console.log(`   ✅ SUCCESS!`);
            console.log(`   📦 ${result.price} TL / ${result.volume}ml → ${normalizedPrice.toFixed(2)} TL/100ml [${usedCalc}]`);

            const reliabilityCheck = checkReliability(result.volume, normalizedPrice, result.price);

            const priceData = {
                productId: product.id,
                price: parseFloat(normalizedPrice.toFixed(2)),
                originalPrice: result.price,
                originalVolume: result.volume,
                productUrl: result.url,
                source: result.source,
                reliable: reliabilityCheck.reliable,
                calculationMethod: usedCalc,
                scrapedAt: new Date().toISOString()
            };

            if (!reliabilityCheck.reliable) {
                priceData.reasons = reliabilityCheck.reasons;
                console.log(`   ⚠️ NEEDS REVIEW: ${reliabilityCheck.reasons.join(', ')}`);
                stats.needsReview++;
                await saveToFirebase(product.id, priceData, true);
            } else {
                console.log(`   ✅ RELIABLE - Auto-approved`);
                stats.reliable++;
                await saveToFirebase(product.id, priceData, false);
            }

            scrapedData.push({ id: product.id, ...priceData });
            fs.writeFileSync(localBackupPath, JSON.stringify(scrapedData, null, 2));

        } catch (e) {
            console.error(`   ❌ Error: ${e.message}`);
            stats.failed++;
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 SCRAPING COMPLETE`);
    console.log(`   Total: ${stats.total}`);
    console.log(`   ✅ Reliable: ${stats.reliable}`);
    console.log(`   ⚠️ Needs Review: ${stats.needsReview}`);
    console.log(`   ❌ Failed: ${stats.failed}`);
    console.log(`\n💾 Local backup: ${localBackupPath}`);

    await browser.close();
}

runScraper().catch(console.error);
