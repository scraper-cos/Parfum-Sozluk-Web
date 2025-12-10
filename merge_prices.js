import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'src', 'data', 'db.js');
const pricesPath = path.join(__dirname, 'prices.json');

if (!fs.existsSync(pricesPath)) {
    console.error('❌ prices.json not found!');
    process.exit(1);
}

let dbContent = fs.readFileSync(dbPath, 'utf8');
const pricesData = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));

console.log(`📊 Merging ${pricesData.length} price updates into db.js...`);

let updatesCount = 0;

pricesData.forEach(item => {
    // Find the object block for this ID
    // Regex looks for "id: X," followed by any content until "}"
    // We use a non-greedy match for the content
    const objectBlockRegex = new RegExp(`(id:\\s*${item.id},[\\s\\S]*?)(})`, 'm');

    if (dbContent.match(objectBlockRegex)) {
        // Construct new fields string
        // We check if fields already exist to avoid duplicates, though the scraper might have added them partially
        // Ideally we replace them if they exist, or add them if they don't.

        // Simple approach: Remove existing price/url fields if they exist in the block, then append new ones.
        // But regex replacement on the whole file for specific fields within a specific block is tricky.

        // Better approach: 
        // 1. Match the block.
        // 2. Inside the block, remove lines starting with "price:", "originalPrice:", "originalVolume:", "productUrl:".
        // 3. Append new fields before the closing brace.

        let block = dbContent.match(objectBlockRegex)[0];

        // Remove existing fields from the block to avoid duplicates
        block = block.replace(/,\s*price: [\d.]+/g, '');
        block = block.replace(/,\s*originalPrice: [\d.]+/g, '');
        block = block.replace(/,\s*originalVolume: \d+/g, '');
        block = block.replace(/,\s*productUrl: "[^"]+"/g, '');
        // Also remove without comma if they were at start (unlikely given id is first)

        // Clean up any trailing commas or newlines left behind might be hard, but let's just append cleanly.

        const newFields = `,\n        price: ${item.price},\n        originalPrice: ${item.originalPrice},\n        originalVolume: ${item.originalVolume},\n        productUrl: "${item.productUrl}"`;

        // Insert new fields before the closing brace '}'
        const updatedBlock = block.replace(/}$/, `${newFields}\n    }`);

        // Replace the old block with the new block in the file content
        dbContent = dbContent.replace(objectBlockRegex, updatedBlock);
        updatesCount++;
    } else {
        console.warn(`⚠️ Product ID ${item.id} not found in db.js`);
    }
});

fs.writeFileSync(dbPath, dbContent);
console.log(`✅ Successfully updated ${updatesCount} products in db.js!`);
