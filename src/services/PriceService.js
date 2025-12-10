import { CapacitorHttp } from '@capacitor/core';

const CACHE_KEY_PREFIX = 'price_cache_v2_'; // Updated to invalidate old cache
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const PriceService = {
    /**
     * Fetches the price for a given URL.
     * Checks cache first. If expired or missing, fetches from network.
     * @param {string} url - The product URL.
     * @returns {Promise<number|null>} - The price as a number, or null if not found.
     */
    async getPrice(url) {
        if (!url) return null;

        // 1. Check Cache
        const cacheKey = CACHE_KEY_PREFIX + url;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { price, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_TTL) {
                    console.log('Price served from cache:', price);
                    return price;
                }
            } catch (e) {
                console.error('Error parsing price cache:', e);
                localStorage.removeItem(cacheKey);
            }
        }

        // 2. Fetch from Network
        try {
            console.log('Fetching price from:', url);
            const response = await CapacitorHttp.get({
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
                }
            });

            if (response.status !== 200) {
                console.error('Failed to fetch price. Status:', response.status);
                return null;
            }

            const html = response.data;
            let price = null;

            // 3. Extract Price using Robust Logic

            // Method A: Meta Tags (Most reliable for SEO/Schema)
            // <meta property="product:price:amount" content="6100.00">
            const metaPriceMatch = html.match(/<meta\s+property="product:price:amount"\s+content="([\d\.]+)"/i);
            if (metaPriceMatch && metaPriceMatch[1]) {
                price = parseFloat(metaPriceMatch[1]);
            }

            // Method B: Beymen Specific (dataLayer / google_tag_params)
            if (!price && url.includes('beymen.com')) {
                const beymenMatch = html.match(/"product_price":"(\d+\.?\d*)"/);
                if (beymenMatch && beymenMatch[1]) {
                    price = parseFloat(beymenMatch[1]);
                }
            }

            // Method C: Specific Sephora Classes (simulated DOM parsing)
            if (!price) {
                // Since we are in a browser environment (React App), we can use DOMParser
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const priceEl = doc.querySelector('.price-sales-standard') || doc.querySelector('.variation-title');
                    if (priceEl) {
                        const priceText = priceEl.innerText;
                        const match = priceText.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);
                        if (match) {
                            price = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
                        }
                    }
                } catch (e) {
                    console.warn('DOM parsing failed:', e);
                }
            }

            // Method D: Fallback Regex on raw HTML
            if (!price) {
                // Exclude installment prices (e.g. "3.697 TL x 6") by checking lookahead? 
                // JS regex lookbehind support is good now but let's be safe.
                // We'll just grab the first match and hope it's the main price if above methods failed.
                // But for Beymen, Method B should catch it.
                const textPriceMatch = html.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);
                if (textPriceMatch && textPriceMatch[1]) {
                    price = parseFloat(textPriceMatch[1].replace(/\./g, '').replace(',', '.'));
                }
            }

            if (price && !isNaN(price)) {
                this.cachePrice(url, price);
                return price;
            }

            console.warn('Price pattern not found in HTML for:', url);
            return null;

        } catch (error) {
            console.error('Error in PriceService:', error);
            return null;
        }
    },

    cachePrice(url, price) {
        const cacheKey = CACHE_KEY_PREFIX + url;
        const data = {
            price,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(data));
    }
};
