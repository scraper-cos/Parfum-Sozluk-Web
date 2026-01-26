# 🚀 Faz 1 Kurulum Talimatları

## ✅ Tamamlananlar

- ✅ Firebase Admin SDK kuruldu
- ✅ `scraper-firebase.js` - İyileştirilmiş scraper (güvenilirlik filtreleri ile)
- ✅ `migrate-prices-to-firebase.js` - Mevcut fiyatları Firebase'e aktarma
- ✅ `.gitignore` güncellendi (güvenlik için)

---

## 📋 Yapmanız Gerekenler

### 1️⃣ Firebase Service Account Key'i Alın

1. **Firebase Console'a git:** https://console.firebase.google.com/
2. Projenizi seçin: **parfumsozluk-aa1f3**
3. Sol menüden: **⚙️ Project Settings** → **Service Accounts** sekmesi
4. **Generate New Private Key** düğmesine tıklayın
5. İndirilen JSON dosyasını projenizin kök dizinine `firebase-service-account.json` adıyla kaydedin

> **⚠️ ÖNEMLİ:** Bu dosya gizlidir! `.gitignore`'a eklenmiştir, GitHub'a yüklenmeyecektir.

---

### 2️⃣ Mevcut Fiyatları Firebase'e Migrate Edin

Terminal'de şu komutu çalıştırın:

```bash
node migrate-prices-to-firebase.js
```

**Beklenen Çıktı:**
```
🔄 Starting migration of existing prices to Firebase...
📦 Found 93 prices to migrate

Processing ID 2: 21750 TL/100ml (from 4350 TL / 20ml)
  ⚠️ Migrated to 'pricesNeedsReview' (small_volume)
...

📊 MIGRATION COMPLETE
   ✅ Reliable: 85
   ⚠️ Needs Review: 8
   ❌ Failed: 0
```

**Ne Olur?**
- Güvenilir fiyatlar → `prices` koleksiyonu (otomatik onaylandı)
- Şüpheli fiyatlar → `pricesNeedsReview` koleksiyonu (manuel inceleme gerekli)

---

### 3️⃣ Firebase Console'da Kontrol Edin

Firebase Console'a gidip Firestore Database'i açın:
https://console.firebase.google.com/project/parfumsozluk-aa1f3/firestore

**Göreceğiniz koleksiyonlar:**
- ✅ `prices` - Güvenilir fiyatlar (85 ürün bekleniyor)
- ⚠️ `pricesNeedsReview` - İnceleme gereken fiyatlar (8 ürün bekleniyor)

---

## 🔍 Test: Yeni Scraper'ı Deneyin

Tek bir üründe test yapmak isterseniz:

1. `scraper-firebase.js` dosyasını açın
2. Satır 33'teki `const products = originals;` satırını değiştirin:
   ```javascript
   // Sadece ilk ürünü test et
   const products = originals.slice(0, 1);
   ```
3. Çalıştırın:
   ```bash
   node scraper-firebase.js
   ```

**Beklenen Çıktı:**
```
🚀 Starting Price Scraper (Firebase Mode)...
✅ Firebase Admin initialized
📊 Total Products: 1
⏳ Remaining: 1

🔍 Processing (1): Dior - Sauvage
🔗 Found URL: https://...
📦 Data Extracted: 5085 TL / 60ml → 8475.00 TL (100ml)
✅ RELIABLE - Auto-approved
✅ Saved to Firebase (prices): Product ID 1

📊 SCRAPING COMPLETE
   ✅ Reliable: 1
   ⚠️ Needs Review: 0
   ❌ Failed: 0
```

---

## 📊 Güvenilirlik Kriterleri

Scraper, aşağıdaki kurallara göre otomatik filtreleme yapar:

| Kriter | Güvenilir Aralık | Sebep |
|--------|------------------|-------|
| **Hacim (Volume)** | 30ml - 200ml | Çok küçük (<30ml) veya çok büyük (>200ml) şüpheli |
| **Normalize Fiyat** | 1,000 - 50,000 TL/100ml | Aşırı ucuz veya pahalı |
| **Orijinal Fiyat** | < 100,000 TL | Set veya hatalar için kontrol |

**Güvenilir değilse → `pricesNeedsReview` koleksiyonuna gider**

---

## 🎯 Sonraki Adım: Faz 2

Faz 1 tamamlandıktan sonra:
- [ ] GitHub Actions workflow'u kurulacak (aylık otomatik çalışma)
- [ ] Admin panel'e review sekmesi eklenecek

**Şu an sadece manuel çalıştırma var, aylık otomatik çalışma Faz 2'de gelecek!**

---

## ❓ Sorun Yaşarsanız

### Firebase bağlanamıyor
- `firebase-service-account.json` dosyasının doğru konumda olduğundan emin olun
- JSON formatının geçerli olduğunu kontrol edin

### Scraper çalışmıyor
- Puppeteer için Chrome/Chromium yüklü olmalı
- DuckDuckGo CAPTCHA gösterirse manuel tamamlayın

### Migration başarısız
- `prices.json` dosyasının mevcut olduğundan emin olun
- Firebase Admin key'inin geçerli olduğunu kontrol edin
