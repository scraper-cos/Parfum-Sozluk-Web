import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'firebase-service-account.json'), 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function manualUpdate() {
    console.log('🔄 Manually updating Coco Mademoiselle...\n');

    // Manuel değerler (Sephora'dan aldınız)
    const price = 8900;  // 100ml fiyatı
    const volume = 100;
    const normalizedPrice = (price / volume) * 100;  // 8900 TL/100ml

    const priceData = {
        productId: 2,
        price: parseFloat(normalizedPrice.toFixed(2)),
        originalPrice: price,
        originalVolume: volume,
        productUrl: 'https://www.sephora.com.tr/p/coco-mademoiselle-P96042.html',
        source: 'sephora_manual',
        reliable: true,
        calculationMethod: 'DIRECT',
        scrapedAt: new Date().toISOString()
    };

    console.log('📦 Data:');
    console.log(`   Price: ${price} TL`);
    console.log(`   Volume: ${volume}ml`);
    console.log(`   Normalized: ${normalizedPrice.toFixed(2)} TL/100ml`);
    console.log(`\n🔄 OLD: 21750 TL/100ml → NEW: ${normalizedPrice.toFixed(2)} TL/100ml`);

    await db.collection('prices').doc('2').set({
        ...priceData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('\n✅ Firebase updated successfully!');
    console.log('\n🎯 Uygulamada şimdi 8900 TL/100ml göstermelidir.');

    process.exit(0);
}

manualUpdate().catch(console.error);
