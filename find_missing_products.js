import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'src', 'data', 'db.js');
const outputPath = path.join(__dirname, 'missing_products.json');

// Read db.js content
let dbContent = fs.readFileSync(dbPath, 'utf8');

// Extract the array content using regex to avoid importing issues with ES modules in this context
const match = dbContent.match(/export const originals = (\[[\s\S]*?\]);/);

if (!match) {
    console.error('❌ Could not find originals array in db.js');
    process.exit(1);
}

// We need to make the string valid JSON to parse it
// 1. Remove comments
// 2. Quote keys (id:, brand:, etc.)
let jsonString = match[1];

// Simple eval approach (safe here as we trust our own file) to get the object
// We'll use a temporary file to import it properly if regex fails, but let's try a safer regex extraction first.
// Actually, since it's a JS file, let's just use a regex loop to find objects without price.

const missingProducts = [];
const objectRegex = /{\s*id:\s*(\d+),[\s\S]*?}/g;
let objMatch;

while ((objMatch = objectRegex.exec(dbContent)) !== null) {
    const block = objMatch[0];

    // Check if price exists in this block
    if (!block.includes('price:')) {
        // Extract brand and name
        const brandMatch = block.match(/brand:\s*"([^"]+)"/);
        const nameMatch = block.match(/name:\s*"([^"]+)"/);

        if (brandMatch && nameMatch) {
            missingProducts.push({
                id: parseInt(objMatch[1]),
                brand: brandMatch[1],
                name: nameMatch[1],
                url: "" // Empty for user to fill
            });
        }
    }
}

console.log(`Found ${missingProducts.length} products missing price data.`);

fs.writeFileSync(outputPath, JSON.stringify(missingProducts, null, 2));
console.log(`✅ Generated ${outputPath}`);
