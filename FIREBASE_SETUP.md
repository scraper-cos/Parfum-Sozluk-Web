# Firebase Service Account Anahtarı Nasıl Alınır?

## Adımlar:

1. **Firebase Console'a git:** https://console.firebase.google.com/
2. Projenizi seçin: `parfumsozluk-aa1f3`
3. Sol menüden **⚙️ Project Settings** (Proje Ayarları) → **Service Accounts** sekmesi
4. **Generate New Private Key** düğmesine tıklayın
5. İndirilen JSON dosyasını `firebase-service-account.json` olarak kaydedin
6. Bu dosyayı projenizin kök dizinine koyun
7. **ÖNEMLİ:** Bu dosya gizli bilgiler içerir, asla GitHub'a yüklemeyin!

## Güvenlik:

- ✅ `.gitignore` dosyasına otomatik eklendi
- ❌ Bu dosyayı kimseyle paylaşmayın
- 🔐 GitHub Actions için Secret olarak eklenecek (Faz 2'de)

## Dosya Konumu:

```
Parfum-Sozluk/
├── firebase-service-account.json  ← Buraya koyun
├── scraper-firebase.js
└── ...
```
