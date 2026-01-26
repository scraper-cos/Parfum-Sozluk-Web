import puppeteer from 'puppeteer';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin initialization
const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'firebase-service-account.json'), 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateCoco() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    console.log('🔍 Checking: Chanel Coco Mademoiselle\n');

    // Go directly to product page
    const productUrl = 'https://www.sephora.com.tr/p/coco-mademoiselle-P96042.html';
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const title = await page.title();
    console.log(`📄 Title: ${title}\n`);

    // Check for 100ml option
    const volumes = await page.evaluate(() => {
        const buttons = document.querySelectorAll('.variation-button, .variation-option');
        const found = [];
        buttons.forEach(btn => {
            const text = btn.getAttribute('title') || btn.innerText || '';
            const match = text.match(/(\d+)\s?(ml|ML|Ml)/);
            if (match) {
                found.push({
                    volume: parseInt(match[1]),
                    text: text.trim(),
                    element: btn
                });
            }
        });
        return found;
    });

    console.log('📦 Available volumes:');
    volumes.forEach(v => console.log(`   - ${v.volume}ml: ${v.text}`));

    // Try to select 100ml
    if (volumes.some(v => v.volume === 100)) {
        console.log('\n✨ Selecting 100ml...');
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('.variation-button, .variation-option');
            for (const btn of buttons) {
                const text = btn.getAttribute('title') || btn.innerText || '';
                if (text.match(/100\s?(ml|ML|Ml)/)) {
                    btn.click();
                    console.log('Clicked:', text);
                    return;
                }
            }
        });
        await new Promise(r => setTimeout(r, 2000));
    }

    // Get price
    const priceText = await page.evaluate(() => {
        const el = document.querySelector('.price-sales-standard') || document.querySelector('.variation-title') || document.querySelector('.price');
        return el ? el.innerText : '';
    });

    console.log(`\n💰 Price element text: "${priceText}"`);

    const priceMatch = priceText.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);
    if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'));
        console.log(`✅ Extracted price: ${price} TL`);

        // Get selected volume
        const volumeText = await page.evaluate(() => {
            const sel = document.querySelector('.variation-option.is-selected, .variation-button.selected');
            if (sel) return sel.getAttribute('title') || sel.innerText;

            // Try title
            const pageTitle = document.title;
            return pageTitle;
        });

        console.log(`📦 Volume text: "${volumeText}"`);

        const volMatch = volumeText.match(/(\d+)\s?(ml|ML|Ml)/);
        if (volMatch) {
            const volume = parseInt(volMatch[1]);
            const normalizedPrice = (price / volume) * 100;

            console.log(`📊 Volume: ${volume}ml`);
            console.log(`📈 Normalized: ${normalizedPrice.toFixed(2)} TL/100ml`);
            console.log(`📐 Method: ${volume === 100 ? 'DIRECT (100ml)' : 'CALCULATED'}`);

            // Update Firebase
            const priceData = {
                productId: 2,
                price: parseFloat(normalizedPrice.toFixed(2)),
                originalPrice: price,
                originalVolume: volume,
                productUrl: productUrl,
                source: 'sephora',
                reliable: true,
                calculationMethod: volume === 100 ? 'DIRECT' : 'CALCULATED',
                scrapedAt: new Date().toISOString()
            };

            console.log('\n📤 Updating Firebase...');
            await db.collection('prices').doc('2').set({
                ...priceData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Firebase updated!');
            console.log(`\n🎯 OLD: 21750 TL/100ml → NEW: ${normalizedPrice.toFixed(2)} TL/100ml`);
        }
    }

    console.log('\n✅ Complete! Check browser for 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
    process.exit(0);
}

updateCoco().catch(console.error);
