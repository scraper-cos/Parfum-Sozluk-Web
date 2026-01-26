import puppeteer from 'puppeteer';

async function testSelectors() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    console.log('\n=== TESTING SEPHORA ===');
    const sephoraUrl = 'https://www.sephora.com.tr/search?q=Dior+Sauvage';
    await page.goto(sephoraUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    // Test different selectors
    const selectors = [
        '.product-tile a.product-link',
        '.product-tile a',
        'a.product-link',
        '.product a',
        '[data-test-id="product-tile"] a',
        '.tile-container a',
        '.product-grid a',
        'a[href*="/p/"]'
    ];

    console.log('\nTrying selectors:');
    for (const selector of selectors) {
        const found = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            return el ? el.href : null;
        }, selector);

        console.log(`  ${selector}: ${found ? '✅ ' + found : '❌'}`);
    }

    console.log('\n=== TESTING BEYMEN ===');
    const beymenUrl = 'https://www.beymen.com/search?query=Dior+Sauvage';
    await page.goto(beymenUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const beymenSelectors = [
        '.o-productCard__link',
        '.o-product__link',
        '.product-card a',
        'a[href*="/product/"]',
        '.product-list a',
        '[data-test="product-card"] a'
    ];

    console.log('\nTrying selectors:');
    for (const selector of beymenSelectors) {
        const found = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            return el ? el.href : null;
        }, selector);

        console.log(`  ${selector}: ${found ? '✅ ' + found : '❌'}`);
    }

    console.log('\n=== TESTING VICTORIA\'S SECRET ===');
    const vsUrl = 'https://www.victoriassecret.com.tr/search?q=Bombshell';
    await page.goto(vsUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3000));

    const vsSelectors = [
        '.product-tile a',
        'a.product-link',
        '.tile a',
        'a[href*="/p/"]',
        '.product a',
        '[data-product] a'
    ];

    console.log('\nTrying selectors:');
    for (const selector of vsSelectors) {
        const found = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            return el ? el.href : null;
        }, selector);

        console.log(`  ${selector}: ${found ? '✅ ' + found : '❌'}`);
    }

    console.log('\n\n✅ Test complete! Check results above.');
    console.log('Press Ctrl+C to exit when done inspecting...');

    // Keep browser open for manual inspection
    await new Promise(() => { });
}

testSelectors().catch(console.error);
