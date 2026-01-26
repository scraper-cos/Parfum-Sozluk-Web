import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'firebase-service-account.json'), 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateExistingPrices() {
    console.log('🔄 Starting migration of existing prices to Firebase...\n');

    // Load prices.json
    const pricesPath = path.join(__dirname, 'prices.json');

    if (!fs.existsSync(pricesPath)) {
        console.log('❌ prices.json not found. No data to migrate.');
        return;
    }

    const pricesData = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
    console.log(`📦 Found ${pricesData.length} prices to migrate\n`);

    let stats = {
        reliable: 0,
        needsReview: 0,
        failed: 0
    };

    for (const priceEntry of pricesData) {
        try {
            const {
                id,
                price,
                originalPrice,
                originalVolume,
                productUrl,
                timestamp
            } = priceEntry;

            console.log(`Processing ID ${id}: ${price} TL/100ml (from ${originalPrice} TL / ${originalVolume}ml)`);

            // Check reliability
            const isReliable = (
                originalVolume >= 30 &&
                originalVolume <= 200 &&
                price >= 1000 &&
                price <= 50000 &&
                originalPrice <= 100000
            );

            const priceData = {
                productId: id,
                price: price,
                originalPrice: originalPrice,
                originalVolume: originalVolume,
                productUrl: productUrl,
                source: 'scraped',
                reliable: isReliable,
                scrapedAt: timestamp,
                migratedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            if (isReliable) {
                // Save to prices collection
                await db.collection('prices').doc(id.toString()).set(priceData);
                console.log(`  ✅ Migrated to 'prices' (reliable)\n`);
                stats.reliable++;
            } else {
                // Save to pricesNeedsReview collection
                const reasons = [];
                if (originalVolume < 30) reasons.push('small_volume');
                if (originalVolume > 200) reasons.push('large_volume_set');
                if (price > 50000) reasons.push('high_normalized_price');
                if (price < 1000) reasons.push('low_normalized_price');
                if (originalPrice > 100000) reasons.push('high_original_price');

                priceData.reasons = reasons;
                await db.collection('pricesNeedsReview').doc(id.toString()).set(priceData);
                console.log(`  ⚠️ Migrated to 'pricesNeedsReview' (${reasons.join(', ')})\n`);
                stats.needsReview++;
            }

        } catch (error) {
            console.error(`  ❌ Failed to migrate ID ${priceEntry.id}:`, error.message, '\n');
            stats.failed++;
        }
    }

    console.log('\n📊 MIGRATION COMPLETE');
    console.log(`   ✅ Reliable: ${stats.reliable}`);
    console.log(`   ⚠️ Needs Review: ${stats.needsReview}`);
    console.log(`   ❌ Failed: ${stats.failed}`);
    console.log(`\n🎉 Firebase collections created and populated!`);

    process.exit(0);
}

migrateExistingPrices().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});
