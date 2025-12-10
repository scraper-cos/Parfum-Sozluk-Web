const fs = require('fs');
const path = require('path');

// db.js'den veriyi manuel olarak alıyoruz (import sorunu yaşamamak için)
const originals = [
    {
        id: 1,
        brand: "Dior",
        name: "Sauvage",
        gender: "Erkek",
        notes: "Calabria Bergamotu, Sichuan Biberi, Ambroxan, Lavanta, Paçuli",
        image: "/parfumler/dior-sauvage.jpg",
        scentFamily: "Aromatik / Baharatlı"
    },
    {
        id: 2,
        brand: "Chanel",
        name: "Coco Mademoiselle",
        gender: "Kadın",
        notes: "Portakal, Yasemin, Gül, Paçuli",
        image: "/parfumler/chanel-coco-mademoiselle.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 3,
        brand: "Creed",
        name: "Aventus",
        gender: "Erkek",
        notes: "Ananas, Siyah Frenk Üzümü, Huş Ağacı, Misk, Meşe Yosunu",
        image: "/parfumler/creed-aventus.jpg",
        scentFamily: "Meyvemsi / Şipre"
    },
    {
        id: 4,
        brand: "Yves Saint Laurent",
        name: "Black Opium",
        gender: "Kadın",
        notes: "Siyah Kahve, Vanilya, Armut, Portakal Çiçeği, Yasemin",
        image: "/parfumler/ysl-black-opium.jpg",
        scentFamily: "Oryantal / Gurme (Tatlı)"
    },
    {
        id: 5,
        brand: "Tom Ford",
        name: "Black Orchid",
        gender: "Unisex",
        notes: "Trüf Mantarı, Orkide, Çikolata, Paçuli",
        image: "/parfumler/tom-ford-black-orchid.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 6,
        brand: "MFK",
        name: "Baccarat Rouge 540",
        gender: "Unisex",
        notes: "Yasemin, Safran, Ambergris, Sedir Ağacı, Misk",
        image: "/parfumler/mfk-baccarat-rouge-540.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 7,
        brand: "Lancôme",
        name: "La Vie Est Belle",
        gender: "Kadın",
        notes: "İris Çiçeği, Yasemin, Portakal Çiçeği, Pralin, Vanilya",
        image: "/parfumler/lancome-la-vie-est-belle.jpg",
        scentFamily: "Çiçeksi / Meyvemsi (Gurme)"
    },
    {
        id: 8,
        brand: "Paco Rabanne",
        name: "Invictus",
        gender: "Erkek",
        notes: "Greyfurt, Deniz Notaları, Defne Yaprağı, Yasemin, Amber",
        image: "/parfumler/paco-rabanne-invictus.jpg",
        scentFamily: "Odunsu / Sucul"
    },
    {
        id: 9,
        brand: "Victoria's Secret",
        name: "Bombshell",
        gender: "Kadın",
        notes: "Çarkıfelek Meyvesi, Greyfurt, Şakayık, Vanilya Orkidesi",
        image: "/parfumler/victorias-secret-bombshell.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 10,
        brand: "Yves Saint Laurent",
        name: "Libre",
        gender: "Kadın",
        notes: "Lavanta, Mandalina, Portakal Çiçeği, Vanilya, Amber",
        image: "/parfumler/ysl-libre.jpg",
        scentFamily: "Fujer / Çiçeksi"
    },
    {
        id: 11,
        brand: "Carolina Herrera",
        name: "Good Girl",
        gender: "Kadın",
        notes: "Badem, Kahve, Sümbülteber, Yasemin, Tonka Fasulyesi",
        image: "/parfumler/carolina-herrera-good-girl.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 12,
        brand: "Chanel",
        name: "Chance Eau Tendre",
        gender: "Kadın",
        notes: "Elma, Greyfurt, Gül, Menekşe, Misk, Sandal Ağacı",
        image: "/parfumler/chanel-chance-eau-tendre.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 13,
        brand: "Dior",
        name: "Hypnotic Poison",
        gender: "Kadın",
        notes: "Hindistan Cevizi, Mürdüm Eriği, Sümbülteber, Vanilya",
        image: "/parfumler/dior-hypnotic-poison.jpg",
        scentFamily: "Oryantal / Vanilya"
    },
    {
        id: 14,
        brand: "Chanel",
        name: "Bleu de Chanel",
        gender: "Erkek",
        notes: "Greyfurt, Nane, Zencefil, Tütsü, Sedir Ağacı, Pembe Biber",
        image: "/parfumler/chanel-bleu-de-chanel.jpg",
        scentFamily: "Odunsu / Aromatik"
    },
    {
        id: 15,
        brand: "Thierry Mugler",
        name: "Alien",
        gender: "Kadın",
        notes: "Kiraz Çiçeği, Manolya, Tonka Fasulyesi, Badem",
        image: "/parfumler/thierry-mugler-alien.jpg",
        scentFamily: "Oryantal / Odunsu"
    },
    {
        id: 16,
        brand: "Giorgio Armani",
        name: "Si",
        gender: "Kadın",
        notes: "Siyah Frenk Üzümü, Gül, Frezya, Vanilya, Paçuli",
        image: "/parfumler/giorgio-armani-si.jpg",
        scentFamily: "Şipre / Meyvemsi"
    },
    {
        id: 17,
        brand: "D&G",
        name: "The One",
        gender: "Kadın",
        notes: "Mandalina, Çarkıfelek Meyvesi, Vanilya, Misk, Amber",
        image: "/parfumler/dg-the-one.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 18,
        brand: "DKNY",
        name: "Be Delicious",
        gender: "Kadın",
        notes: "Elma, Karpuz, Menekşe, İris, Beyaz Misk",
        image: "/parfumler/dkny-be-delicious.jpg",
        scentFamily: "Çiçeksi / Meyvemsi (Fresh)"
    },
    {
        id: 19,
        brand: "Lancôme",
        name: "La Nuit Trésor",
        gender: "Kadın",
        notes: "Kırmızı Meyveler, Gül, Vanilya, Misk, Sedir Ağacı",
        image: "/parfumler/lancome-la-nuit-tresor.jpg",
        scentFamily: "Oryantal / Vanilya"
    },
    {
        id: 20,
        brand: "Tom Ford",
        name: "Tobacco Vanille",
        gender: "Erkek",
        notes: "Tütün, Vanilya, Tonka Fasulyesi, Kakao, Kuru Meyveler",
        image: "/parfumler/tom-ford-tobacco-vanille.jpg",
        scentFamily: "Baharatlı / Oryantal"
    },
    {
        id: 21,
        brand: "Jo Malone",
        name: "Wood Sage & Sea Salt",
        gender: "Unisex",
        notes: "Abanoz Ağacı, Karanfil, Tuzlu Notalar",
        image: "/parfumler/jo-malone-wood-sage-sea-salt.jpg",
        scentFamily: "Aromatik / Odunsu"
    },
    {
        id: 22,
        brand: "Versace",
        name: "Eros",
        gender: "Erkek",
        notes: "Nane Yaprakları, Yeşil Elma, Limon, Tonka Fasulyesi",
        image: "/parfumler/versace-eros.jpg",
        scentFamily: "Aromatik / Fujer"
    },
    {
        id: 23,
        brand: "Louis Vuitton",
        name: "Imagination",
        gender: "Erkek",
        notes: "Ağaç kavunu, Calabrian bergamot, Çin Siyah Çayı",
        image: "/parfumler/louis-vuitton-imagination.jpg",
        scentFamily: "Turunçgil / Aromatik"
    },
    {
        id: 24,
        brand: "Parfums de Marly",
        name: "Delina",
        gender: "Kadın",
        notes: "Liçi, Ravent, Türk Gülü, Şakayık, Misk, Kaşmir",
        image: "/parfumler/parfums-de-marly-delina.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 25,
        brand: "Armani",
        name: "Acqua di Giò",
        gender: "Erkek",
        notes: "Deniz Notaları, Bergamot, Biberiye, Paçuli, Tütsü",
        image: "/parfumler/armani-acqua-di-gio.jpg",
        scentFamily: "Sucul / Aromatik"
    },
    {
        id: 26,
        brand: "Gucci",
        name: "Guilty Pour Homme",
        gender: "Erkek",
        notes: "Limon, Lavanta, Portakal Çiçeği, Sedir Ağacı, Paçuli",
        image: "/parfumler/gucci-guilty-pour-homme.jpg",
        scentFamily: "Odunsu / Aromatik"
    },
    {
        id: 27,
        brand: "Valentino",
        name: "Uomo",
        gender: "Erkek",
        notes: "İris, Kakule, Biber, Vetiver, Amber, Sedir",
        image: "/parfumler/valentino-uomo.jpg",
        scentFamily: "Deri / Odunsu"
    },
    {
        id: 28,
        brand: "Armani",
        name: "Stronger With You",
        gender: "Erkek",
        notes: "Kakule, Pembe Biber, Adaçayı, Kestane, Vanilya",
        image: "/parfumler/armani-stronger-with-you.jpg",
        scentFamily: "Aromatik / Fujer"
    },
    {
        id: 29,
        brand: "Kenzo",
        name: "Homme",
        gender: "Erkek",
        notes: "Deniz Notaları, Çam, Sedir, Sandal Ağacı",
        image: "/parfumler/kenzo-homme.jpg",
        scentFamily: "Odunsu / Sucul"
    },
    {
        id: 30,
        brand: "Hugo Boss",
        name: "Bottled",
        gender: "Erkek",
        notes: "Elma, Tarçın, Sardunya, Sandal Ağacı, Sedir, Vetiver",
        image: "/parfumler/hugo-boss-bottled.jpg",
        scentFamily: "Odunsu / Baharatlı"
    },
    {
        id: 31,
        brand: "Paco Rabanne",
        name: "Olympea",
        gender: "Kadın",
        notes: "Tuzlu Vanilya, Yeşil Mandalina, Su Yasemini, Kaşmir Ağacı",
        image: "/parfumler/paco-rabanne-olympea.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 32,
        brand: "Jean Paul Gaultier",
        name: "Scandal",
        gender: "Kadın",
        notes: "Bal, Gardenya, Kan Portakalı, Paçuli",
        image: "/parfumler/jean-paul-gaultier-scandal.jpg",
        scentFamily: "Şipre / Çiçeksi (Bal)"
    },
    {
        id: 33,
        brand: "Givenchy",
        name: "Amarige",
        gender: "Kadın",
        notes: "Mimoza, Kavun, Şeftali",
        image: "/parfumler/givenchy-amarige.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 34,
        brand: "Armani",
        name: "She (Lei)",
        gender: "Kadın",
        notes: "Armut, Misk, Vanilya",
        image: "/parfumler/armani-she.jpg",
        scentFamily: "Oryantal"
    },
    {
        id: 35,
        brand: "Cacharel",
        name: "Amor Amor",
        gender: "Kadın",
        notes: "Siyah Frenk Üzümü, Portakal, Gül",
        image: "/parfumler/cacharel-amor-amor.jpg",
        scentFamily: "Meyvemsi"
    },
    {
        id: 36,
        brand: "Burberry",
        name: "Weekend",
        gender: "Kadın",
        notes: "Mandalina, Ot, Nektarin",
        image: "/parfumler/burberry-weekend.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 37,
        brand: "Burberry",
        name: "Classic",
        gender: "Kadın",
        notes: "Şeftali, Kayısı, Sandal Ağacı",
        image: "/parfumler/burberry-classic.jpg",
        scentFamily: "Odunsu"
    },
    {
        id: 38,
        brand: "Britney Spears",
        name: "Fantasy",
        gender: "Kadın",
        notes: "Kivi, Beyaz Çikolata, Kapkek",
        image: "/parfumler/britney-spears-fantasy.jpg",
        scentFamily: "Tatlı (Gurme)"
    },
    {
        id: 39,
        brand: "Chanel",
        name: "No.5",
        gender: "Kadın",
        notes: "Ylang-Ylang, Neroli, Gül",
        image: "/parfumler/chanel-no5.jpg",
        scentFamily: "Aldehitli"
    },
    {
        id: 40,
        brand: "Cacharel",
        name: "Noa",
        gender: "Kadın",
        notes: "Beyaz Misk, Şakayık, Kahve",
        image: "/parfumler/cacharel-noa.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 41,
        brand: "Chloé",
        name: "Love",
        gender: "Kadın",
        notes: "İris, Misk, Sümbül, Pirinç",
        image: "/parfumler/chloe-love.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 42,
        brand: "Chanel",
        name: "Chance",
        gender: "Kadın",
        notes: "Pembe Biber, Yasemin, Paçuli",
        image: "/parfumler/chanel-chance.jpg",
        scentFamily: "Şipre"
    },
    {
        id: 43,
        brand: "Davidoff",
        name: "Cool Water",
        gender: "Kadın",
        notes: "Kavun, Ananas, Lotus",
        image: "/parfumler/davidoff-cool-water.jpg",
        scentFamily: "Sucul (Fresh)"
    },
    {
        id: 44,
        brand: "Dior",
        name: "Addict",
        gender: "Kadın",
        notes: "Böğürtlen, Yasemin, Vanilya",
        image: "/parfumler/dior-addict.jpg",
        scentFamily: "Oryantal"
    },
    {
        id: 45,
        brand: "Escada",
        name: "Collection",
        gender: "Kadın",
        notes: "Karamel, Bal, Erik",
        image: "/parfumler/escada-collection.jpg",
        scentFamily: "Tatlı (Gurme)"
    },
    {
        id: 46,
        brand: "Armani",
        name: "Diamonds",
        gender: "Kadın",
        notes: "Ahududu, Liçi, Gül",
        image: "/parfumler/armani-diamonds.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 47,
        brand: "Gucci",
        name: "Rush",
        gender: "Kadın",
        notes: "Şeftali, Gardenya, Vanilya",
        image: "/parfumler/gucci-rush.jpg",
        scentFamily: "Şipre"
    },
    {
        id: 48,
        brand: "Gucci",
        name: "Flora",
        gender: "Kadın",
        notes: "Osmanthus, Gül, Şakayık",
        image: "/parfumler/gucci-flora.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 49,
        brand: "Gucci",
        name: "Guilty",
        gender: "Kadın",
        notes: "Lilah, Biber, Şeftali",
        image: "/parfumler/gucci-guilty.jpg",
        scentFamily: "Oryantal"
    },
    {
        id: 50,
        brand: "Hugo Boss",
        name: "Deep Red",
        gender: "Kadın",
        notes: "Kan Portakalı, Zencefil, Vanilya",
        image: "/parfumler/hugo-boss-deep-red.jpg",
        scentFamily: "Meyvemsi"
    },
    {
        id: 51,
        brand: "Issey Miyake",
        name: "L'eau D'issey",
        gender: "Kadın",
        notes: "Lotus, Kavun, Zambak",
        image: "/parfumler/issey-miyake-leau-dissey.jpg",
        scentFamily: "Sucul (Fresh)"
    },
    {
        id: 52,
        brand: "Dior",
        name: "J'adore",
        gender: "Kadın",
        notes: "Armut, Kavun, Yasemin",
        image: "/parfumler/dior-jadore.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 53,
        brand: "Jean Paul Gaultier",
        name: "Classique",
        gender: "Kadın",
        notes: "Portakal Çiçeği, Zencefil, Vanilya",
        image: "/parfumler/jpg-classique.jpg",
        scentFamily: "Oryantal"
    },
    {
        id: 54,
        brand: "Kenzo",
        name: "Flower",
        gender: "Kadın",
        notes: "Menekşe, Gül, Vanilya",
        image: "/parfumler/kenzo-flower.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 55,
        brand: "Kenzo",
        name: "L'eau Par Kenzo",
        gender: "Kadın",
        notes: "Nane, Sazlık, Nilüfer",
        image: "/parfumler/kenzo-leau-par-kenzo.jpg",
        scentFamily: "Sucul (Fresh)"
    },
    {
        id: 56,
        brand: "Lacoste",
        name: "Pour Femme",
        gender: "Kadın",
        notes: "Biber, Frezya, Süet",
        image: "/parfumler/lacoste-pour-femme.jpg",
        scentFamily: "Odunsu"
    },
    {
        id: 57,
        brand: "Lancôme",
        name: "Miracle",
        gender: "Kadın",
        notes: "Liçi, Zencefil, Manolya",
        image: "/parfumler/lancome-miracle.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 58,
        brand: "Lancôme",
        name: "Hypnose",
        gender: "Kadın",
        notes: "Çarkıfelek Çiçeği, Vanilya",
        image: "/parfumler/lancome-hypnose.jpg",
        scentFamily: "Oryantal"
    },
    {
        id: 59,
        brand: "Lolita Lempicka",
        name: "Lolita Lempicka",
        gender: "Kadın",
        notes: "Meyan Kökü, Menekşe, Anason",
        image: "/parfumler/lolita-lempicka.jpg",
        scentFamily: "Tatlı (Gurme)"
    },
    {
        id: 60,
        brand: "Victoria's Secret",
        name: "Dream Angels Divine",
        gender: "Kadın",
        notes: "Siklamen, Lotus, Yasemin, Gül, Sandal Ağacı, Amber",
        image: "/parfumler/victorias-secret-dream-angels-divine.jpg",
        scentFamily: "Çiçeksi / Aldehitli"
    },
    {
        id: 61,
        brand: "Chloé",
        name: "Chloé (Signature)",
        gender: "Kadın",
        notes: "Şakayık, Liçi, Gül, Bal, Sedir Ağacı",
        image: "/parfumler/chloe-signature.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 62,
        brand: "Jennifer Lopez",
        name: "Glow",
        gender: "Kadın",
        notes: "Neroli, Greyfurt, Gül, Yasemin, Misk (Sabunsu koku)",
        image: "/parfumler/jlo-glow.jpg",
        scentFamily: "Çiçeksi / Temiz"
    },
    {
        id: 63,
        brand: "Jennifer Lopez",
        name: "Still",
        gender: "Kadın",
        notes: "Earl Grey Çayı, Beyaz Biber, Yasemin, İnci Çiçeği",
        image: "/parfumler/jlo-still.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 64,
        brand: "Armani",
        name: "Acqua di Giò (Kadın)",
        gender: "Kadın",
        notes: "Şakayık, Ananas, Votka, Misk, Zambak",
        image: "/parfumler/armani-acqua-di-gio-kadin.jpg",
        scentFamily: "Sucul / Çiçeksi"
    },
    {
        id: 65,
        brand: "Armani",
        name: "City Glam She",
        gender: "Kadın",
        notes: "Siyah Frenk Üzümü, Erik, Gül, Meşe Yosunu",
        image: "/parfumler/armani-city-glam-she.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 66,
        brand: "Armani",
        name: "Code (Kadın)",
        gender: "Kadın",
        notes: "Portakal Çiçeği, Zencefil, Bal, Vanilya, Sandal Ağacı",
        image: "/parfumler/armani-code-kadin.jpg",
        scentFamily: "Çiçeksi / Oryantal"
    },
    {
        id: 67,
        brand: "Armani",
        name: "Remix (Kadın)",
        gender: "Kadın",
        notes: "Kızılcık, Armut, Şakayık, Manolya",
        image: "/parfumler/armani-remix-kadin.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 68,
        brand: "Armani",
        name: "White (Red & White)",
        gender: "Kadın",
        notes: "Bergamot, Zencefil, Beyaz Misk, Nane",
        image: "/parfumler/armani-white.jpg",
        scentFamily: "Çiçeksi / Odunsu"
    },
    {
        id: 69,
        brand: "Armani",
        name: "Mania (Kadın)",
        gender: "Kadın",
        notes: "Pembe Biber, Mandalina, Sedir, Misk, Defne",
        image: "/parfumler/armani-mania-kadin.jpg",
        scentFamily: "Çiçeksi / Odunsu"
    },
    {
        id: 70,
        brand: "Armani",
        name: "Night (Emporio Night)",
        gender: "Kadın",
        notes: "Kızılcık, Bergamot, Alıç, Sandal Ağacı",
        image: "/parfumler/armani-night.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 71,
        brand: "Armani",
        name: "Giò",
        gender: "Kadın",
        notes: "Gül, Sümbül, Mandalina, Amber, Vanilya",
        image: "/parfumler/armani-gio.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 72,
        brand: "Armani",
        name: "Sensi",
        gender: "Kadın",
        notes: "Akasya, Badem, Buğday, Benzoin",
        image: "/parfumler/armani-sensi.jpg",
        scentFamily: "Odunsu / Oryantal"
    },
    {
        id: 73,
        brand: "Ralph Lauren",
        name: "Romance",
        gender: "Kadın",
        notes: "Gül, Zencefil, Papatya, Beyaz Misk",
        image: "/parfumler/ralph-lauren-romance.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 74,
        brand: "Ralph Lauren",
        name: "Ralph",
        gender: "Kadın",
        notes: "Elma, İtalyan Mandalinası, Manolya, Frezya",
        image: "/parfumler/ralph-lauren-ralph.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 75,
        brand: "Ralph Lauren",
        name: "Glamorous",
        gender: "Kadın",
        notes: "Clementine, Arum Zambağı, Vetiver, Sümbülteber",
        image: "/parfumler/ralph-lauren-glamorous.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 76,
        brand: "Ralph Lauren",
        name: "Hot",
        gender: "Kadın",
        notes: "Baharatlar, İncir Yaprağı, Akçaağaç, Amber",
        image: "/parfumler/ralph-lauren-hot.jpg",
        scentFamily: "Oryantal / Vanilya"
    },
    {
        id: 77,
        brand: "Ralph Lauren",
        name: "Cool",
        gender: "Kadın",
        notes: "Kivi, Salatalık, Karpuz, Ihlamur",
        image: "/parfumler/ralph-lauren-cool.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 78,
        brand: "Ralph Lauren",
        name: "Blue",
        gender: "Kadın",
        notes: "Lotus, Gardenya, Yasemin, Misk",
        image: "/parfumler/ralph-lauren-blue.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 79,
        brand: "Ralph Lauren",
        name: "Safari",
        gender: "Kadın",
        notes: "Galbanum, Mandalina, Nergis, Vetiver",
        image: "/parfumler/ralph-lauren-safari.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 80,
        brand: "Tommy Hilfiger",
        name: "True Star",
        gender: "Kadın",
        notes: "Kavun, Aldehitler, Turunçgil, Misk",
        image: "/parfumler/tommy-hilfiger-true-star.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 81,
        brand: "Tommy Hilfiger",
        name: "Dreaming",
        gender: "Kadın",
        notes: "Şeftali, Sümbülteber, Frezya, Beyaz Odunlar",
        image: "/parfumler/tommy-hilfiger-dreaming.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 82,
        brand: "Tommy Hilfiger",
        name: "T Girl",
        gender: "Kadın",
        notes: "Bergamot, Nergis, Yasemin, Sandal Ağacı",
        image: "/parfumler/tommy-hilfiger-t-girl.jpg",
        scentFamily: "Çiçeksi / Aldehitli"
    },
    {
        id: 83,
        brand: "Tommy Hilfiger",
        name: "Tommy Girl",
        gender: "Kadın",
        notes: "Elma, Kamelya, Mandalina, Nane, Hanımeli",
        image: "/parfumler/tommy-hilfiger-tommy-girl.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 84,
        brand: "Tommy Hilfiger",
        name: "Freedom for Her",
        gender: "Kadın",
        notes: "Zencefil, Kavun, İnci Çiçeği, Yasemin",
        image: "/parfumler/tommy-hilfiger-freedom-for-her.jpg",
        scentFamily: "Yeşil / Çiçeksi"
    },
    {
        id: 85,
        brand: "Lacoste",
        name: "Touch of Pink",
        gender: "Kadın",
        notes: "Kan Portakalı, Kişniş, Kakule, Yasemin, Vanilya",
        image: "/parfumler/lacoste-touch-of-pink.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 86,
        brand: "Lacoste",
        name: "Touch of Sun",
        gender: "Kadın",
        notes: "Bergamot, Greyfurt, Gül, Şakayık, Vetiver",
        image: "/parfumler/lacoste-touch-of-sun.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 87,
        brand: "Lacoste",
        name: "Dream of Pink",
        gender: "Kadın",
        notes: "Kırmızı Meyveler, Buzlu Çay, Lotus, Sandal Ağacı",
        image: "/parfumler/lacoste-dream-of-pink.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 88,
        brand: "Lacoste",
        name: "Love of Pink",
        gender: "Kadın",
        notes: "Kan Portakalı, Limon, Çarkıfelek Meyvesi, Manolya",
        image: "/parfumler/lacoste-love-of-pink.jpg",
        scentFamily: "Şipre / Meyvemsi"
    },
    {
        id: 89,
        brand: "Lacoste",
        name: "Femme de Lacoste",
        gender: "Kadın",
        notes: "Ananas, Mandalina, Bergamot, Portakal Çiçeği, Vanilya",
        image: "/parfumler/lacoste-femme-de-lacoste.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 90,
        brand: "Gucci",
        name: "Rush 2",
        gender: "Kadın",
        notes: "Frezya, İnci Çiçeği, Palmiye Ağacı, Misk",
        image: "/parfumler/gucci-rush-2.jpg",
        scentFamily: "Çiçeksi / Odunsu"
    },
    {
        id: 91,
        brand: "Gucci",
        name: "Gucci by Gucci",
        gender: "Kadın",
        notes: "Guava, Tiare Çiçeği, Paçuli, Bal, Misk",
        image: "/parfumler/gucci-by-gucci.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 92,
        brand: "Gucci",
        name: "Eau de Parfum",
        gender: "Kadın",
        notes: "Heliotrope, Portakal Çiçeği, Vanilya, Süsen, Kimyon",
        image: "/parfumler/gucci-eau-de-parfum.jpg",
        scentFamily: "Oryantal / Baharatlı"
    },
    {
        id: 93,
        brand: "Gucci",
        name: "Envy Me 2",
        gender: "Kadın",
        notes: "Menekşe, Portakal, Manolya, Gül, Paçuli",
        image: "/parfumler/gucci-envy-me-2.jpg",
        scentFamily: "Çiçeksi / Yeşil"
    },
    {
        id: 94,
        brand: "Gucci",
        name: "Envy Me",
        gender: "Kadın",
        notes: "Şakayık, Ananas, Pembe Biber, Liçi, Nar",
        image: "/parfumler/gucci-envy-me.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 95,
        brand: "Gucci",
        name: "Envy",
        gender: "Kadın",
        notes: "Sümbül, İnci Çiçeği, Yasemin, Yeşil Notalar",
        image: "/parfumler/gucci-envy.jpg",
        scentFamily: "Çiçeksi / Yeşil"
    },
    {
        id: 96,
        brand: "Yves Saint Laurent",
        name: "MYSLF",
        gender: "Erkek",
        notes: "Calabria Bergamotu, Tunus Portakal Çiçeği, Endonezya Paçuli",
        image: "/parfumler/ysl-myslf.jpg",
        scentFamily: "Odunsu / Çiçeksi"
    },
    {
        id: 97,
        brand: "Prada",
        name: "Luna Rossa Carbon",
        gender: "Erkek",
        notes: "İtalyan Bergamotu, Lavanta, Ambroxan, Metalik Notalar, Paçuli",
        image: "/parfumler/prada-luna-rossa-carbon.jpg",
        scentFamily: "Aromatik / Fujer"
    },
    {
        id: 98,
        brand: "Jean Paul Gaultier",
        name: "Scandal Pour Homme",
        gender: "Erkek",
        notes: "Misk Adaçayı, Karamel, Tonka Fasulyesi, Vetiver",
        image: "/parfumler/jpg-scandal-pour-homme.jpg",
        scentFamily: "Odunsu / Oryantal"
    },
    {
        id: 99,
        brand: "Dolce & Gabbana",
        name: "The One for Men",
        gender: "Erkek",
        notes: "Greyfurt, Kişniş, Fesleğen, Zencefil, Tütün, Amber",
        image: "/parfumler/dg-the-one-for-men.jpg",
        scentFamily: "Odunsu / Baharatlı"
    },
    {
        id: 100,
        brand: "Dior",
        name: "Fahrenheit",
        gender: "Erkek",
        notes: "Sicilya Mandalinası, Menekşe, Deri, Küçük Hindistan Cevizi",
        image: "/parfumler/dior-fahrenheit.jpg",
        scentFamily: "Odunsu / Deri"
    },
    {
        id: 101,
        brand: "Zadig & Voltaire",
        name: "This Is Her",
        gender: "Kadın",
        notes: "Kestane, Krem Şanti, Sandal Ağacı, Vanilya",
        image: "/parfumler/zadig-voltaire-this-is-her.jpg",
        scentFamily: "Odunsu / Gurme"
    },
    {
        id: 102,
        brand: "Victoria's Secret",
        name: "Bare",
        gender: "Kadın",
        notes: "Avustralya Sandal Ağacı, Mandalina, Menekşe",
        image: "/parfumler/victorias-secret-bare.jpg",
        scentFamily: "Odunsu / Çiçeksi"
    },
    {
        id: 103,
        brand: "Hugo Boss",
        name: "The Scent Intense Her",
        gender: "Kadın",
        notes: "Bal, Şeftali, Osmanthus Çiçeği, Kakao",
        image: "/parfumler/hugo-boss-the-scent-intense-her.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 104,
        brand: "Burberry",
        name: "Her",
        gender: "Kadın",
        notes: "Çilek, Ahududu, Böğürtlen, Misk, Amber",
        image: "/parfumler/burberry-her.jpg",
        scentFamily: "Meyvemsi / Gurme"
    },
    {
        id: 105,
        brand: "Armani",
        name: "My Way",
        gender: "Kadın",
        notes: "Portakal Çiçeği, Bergamot, Sümbülteber, Yasemin",
        image: "/parfumler/armani-my-way.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 106,
        brand: "Yves Saint Laurent",
        name: "Libre Intense",
        gender: "Kadın",
        notes: "Lavanta, Orkide, Vanilya, Tonka Fasulyesi",
        image: "/parfumler/ysl-libre-intense.jpg",
        scentFamily: "Fujer / Oryantal"
    },
    {
        id: 107,
        brand: "Ex Nihilo",
        name: "Fleur Narcotique",
        gender: "Unisex",
        notes: "Liçi, Bergamot, Şeftali, Portakal Çiçeği, Misk",
        image: "/parfumler/ex-nihilo-fleur-narcotique.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 108,
        brand: "Prada",
        name: "Paradoxe",
        gender: "Kadın",
        notes: "Armut, Mandalina, Portakal Çiçeği, Amber, Misk",
        image: "/parfumler/prada-paradoxe.jpg",
        scentFamily: "Çiçeksi / Amber"
    },
    {
        id: 109,
        brand: "Paco Rabanne",
        name: "Fame",
        gender: "Kadın",
        notes: "Mango, Bergamot, Yasemin, Sandal Ağacı, Vanilya",
        image: "/parfumler/paco-rabanne-fame.jpg",
        scentFamily: "Çiçeksi / Odunsu"
    },
    {
        id: 110,
        brand: "Lancôme",
        name: "Idôle",
        gender: "Kadın",
        notes: "Armut, Bergamot, Türk Gülü, Yasemin, Beyaz Misk",
        image: "/parfumler/lancome-idole.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 111,
        brand: "Emporio Armani",
        name: "Because It’s You",
        gender: "Kadın",
        notes: "Ahududu, Neroli, Gül, Vanilya, Misk",
        image: "/parfumler/armani-because-its-you.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 112,
        brand: "Versace",
        name: "Bright Crystal",
        gender: "Kadın",
        notes: "Yuzu, Nar, Şakayık, Lotus, Manolya",
        image: "/parfumler/versace-bright-crystal.jpg",
        scentFamily: "Çiçeksi / Fresh"
    },
    {
        id: 113,
        brand: "Versace",
        name: "Crystal Noir",
        gender: "Kadın",
        notes: "Zencefil, Kakule, Hindistan Cevizi, Gardenya, Amber",
        image: "/parfumler/versace-crystal-noir.jpg",
        scentFamily: "Oryantal / Baharatlı"
    },
    {
        id: 114,
        brand: "Dior",
        name: "Miss Dior Blooming Bouquet",
        gender: "Kadın",
        notes: "Sicilya Mandalinası, Pembe Şakayık, Şam Gülü, Beyaz Misk",
        image: "/parfumler/dior-miss-dior-blooming-bouquet.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 115,
        brand: "Tiziana Terenzi",
        name: "Kirke",
        gender: "Unisex",
        notes: "Çarkıfelek Meyvesi, Şeftali, Ahududu, Armut, Misk",
        image: "/parfumler/tiziana-terenzi-kirke.jpg",
        scentFamily: "Meyvemsi / Şipre"
    },
    {
        id: 116,
        brand: "Cacharel",
        name: "Yes I Am",
        gender: "Kadın",
        notes: "Ahududu, Mandalina, Amber, Süt, Sandal Ağacı",
        image: "/parfumler/cacharel-yes-i-am.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 117,
        brand: "Victoria's Secret",
        name: "Scandalous",
        gender: "Kadın",
        notes: "Ahududu Likörü, Siyah Şakayık, Pralin",
        image: "/parfumler/victorias-secret-scandalous.jpg",
        scentFamily: "Meyvemsi / Çiçeksi"
    },
    {
        id: 118,
        brand: "Davidoff",
        name: "Echo",
        gender: "Kadın",
        notes: "Votka, Beyaz Misk, Şakayık, İris, Menekşe",
        image: "/parfumler/davidoff-echo.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 119,
        brand: "Thierry Mugler",
        name: "Alien Goddess",
        gender: "Kadın",
        notes: "Hindistan Cevizi Suyu, Bergamot, Yasemin, Bourbon Vanilya",
        image: "/parfumler/thierry-mugler-alien-goddess.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 120,
        brand: "Paco Rabanne",
        name: "One Million Lucky",
        gender: "Erkek",
        notes: "Fındık, Erik, Bal, Sedir Ağacı, Amber",
        image: "/parfumler/paco-rabanne-one-million-lucky.jpg",
        scentFamily: "Odunsu / Gurme"
    },
    {
        id: 121,
        brand: "Xerjoff",
        name: "Erba Pura",
        gender: "Unisex",
        notes: "Sicilya Portakalı, Bergamot, Meyve Sepeti, Beyaz Misk",
        image: "/parfumler/xerjoff-erba-pura.jpg",
        scentFamily: "Meyvemsi / Amber"
    },
    {
        id: 122,
        brand: "Jean Paul Gaultier",
        name: "La Belle",
        gender: "Kadın",
        notes: "Armut, Vetiver, Vanilya",
        image: "/parfumler/jpg-la-belle.jpg",
        scentFamily: "Oryantal / Gurme"
    },
    {
        id: 123,
        brand: "Yves Saint Laurent",
        name: "Supreme Bouquet",
        gender: "Unisex",
        notes: "Sümbülteber, Ylang-Ylang, Amber Ağacı",
        image: "/parfumler/ysl-supreme-bouquet.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 124,
        brand: "Amouage",
        name: "Opus V",
        gender: "Unisex",
        notes: "Orris Kökü (Süsen), Rum, Gül, Ud Ağacı (Oud)",
        image: "/parfumler/amouage-opus-v.jpg",
        scentFamily: "Odunsu / Çiçeksi"
    },
    {
        id: 125,
        brand: "Tiziana Terenzi",
        name: "Sirrah",
        gender: "Unisex",
        notes: "Çarkıfelek Meyvesi, Ayva, Safran, Amber, Misk",
        image: "/parfumler/tiziana-terenzi-sirrah.jpg",
        scentFamily: "Meyvemsi / Baharatlı"
    },
    {
        id: 126,
        brand: "Roberto Cavalli",
        name: "Eau de Parfum",
        gender: "Kadın",
        notes: "Pembe Biber, Portakal Çiçeği, Tonka Fasulyesi, Vanilya",
        image: "/parfumler/roberto-cavalli-edp.jpg",
        scentFamily: "Amber / Çiçeksi"
    },
    {
        id: 127,
        brand: "Victoria's Secret",
        name: "Tease Crème Cloud",
        gender: "Kadın",
        notes: "Vanilya Mereng (Beze), Santal Çiçeği, Amber",
        image: "/parfumler/victorias-secret-tease-creme-cloud.jpg",
        scentFamily: "Çiçeksi / Gurme"
    },
    {
        id: 128,
        brand: "Burberry",
        name: "Her Elixir",
        gender: "Kadın",
        notes: "Çilek, Böğürtlen, Yasemin, Vanilya, Amber",
        image: "/parfumler/burberry-her-elixir.jpg",
        scentFamily: "Meyvemsi / Gurme"
    },
    {
        id: 129,
        brand: "Michael Kors",
        name: "Sexy Amber",
        gender: "Kadın",
        notes: "Amber, Sandal Ağacı, Beyaz Çiçekler",
        image: "/parfumler/michael-kors-sexy-amber.jpg",
        scentFamily: "Amber / Çiçeksi"
    },
    {
        id: 130,
        brand: "Dolce & Gabbana",
        name: "Devotion",
        gender: "Kadın",
        notes: "Şekerlenmiş Limon, Portakal Çiçeği, Vanilya",
        image: "/parfumler/dg-devotion.jpg",
        scentFamily: "Gurme / Narenciye"
    },
    {
        id: 131,
        brand: "Chloé",
        name: "Nomade",
        gender: "Kadın",
        notes: "Mirabelle Eriği, Frezya, Meşe Yosunu",
        image: "/parfumler/chloe-nomade.jpg",
        scentFamily: "Şipre / Çiçeksi"
    },
    {
        id: 132,
        brand: "Jean Paul Gaultier",
        name: "Divine",
        gender: "Kadın",
        notes: "Tuzlu Notalar, Zambak, Mereng (Beze)",
        image: "/parfumler/jpg-divine.jpg",
        scentFamily: "Gurme / Tuzlu"
    },
    {
        id: 133,
        brand: "Carolina Herrera",
        name: "212 Sexy",
        gender: "Kadın",
        notes: "Pembe Biber, Pamuk Şeker, Vanilya, Misk",
        image: "/parfumler/carolina-herrera-212-sexy.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 134,
        brand: "Givenchy",
        name: "Absolutely Irresistible",
        gender: "Kadın",
        notes: "Kırmızı Meyveler, Paprika, Yasemin, Amber",
        image: "/parfumler/givenchy-absolutely-irresistible.jpg",
        scentFamily: "Çiçeksi"
    },
    {
        id: 135,
        brand: "Calvin Klein",
        name: "Euphoria",
        gender: "Kadın",
        notes: "Nar, Siyah Orkide, Menekşe, Maun Ağacı",
        image: "/parfumler/calvin-klein-euphoria.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 136,
        brand: "Burberry",
        name: "Goddess",
        gender: "Kadın",
        notes: "Vanilya İnfüzyonu, Lavanta, Vanilya Havyarı",
        image: "/parfumler/burberry-goddess.jpg",
        scentFamily: "Aromatik / Gurme"
    },
    {
        id: 137,
        brand: "Victoria's Secret",
        name: "Very Sexy Orchid",
        gender: "Kadın",
        notes: "Siyah Frenk Üzümü, Orris (Süsen) Kökü, Paçuli",
        image: "/parfumler/victorias-secret-very-sexy-orchid.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 138,
        brand: "Versace",
        name: "Dylan Purple",
        gender: "Kadın",
        notes: "Armut, Acı Portakal, Frezya, Ambroxan",
        image: "/parfumler/versace-dylan-purple.jpg",
        scentFamily: "Meyvemsi / Çiçeksi"
    },
    {
        id: 139,
        brand: "Trussardi",
        name: "Inside For Woman",
        gender: "Kadın",
        notes: "Kahve, Fındık, Teak Ağacı, Amber",
        image: "/parfumler/trussardi-inside-for-woman.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 140,
        brand: "Yves Saint Laurent",
        name: "Black Opium Over Red",
        gender: "Kadın",
        notes: "Kiraz Likörü, Siyah Kahve, Yasemin, Vanilya",
        image: "/parfumler/ysl-black-opium-over-red.jpg",
        scentFamily: "Gurme / Meyvemsi"
    },
    {
        id: 141,
        brand: "Lancôme",
        name: "La Vie Est Belle Intensément",
        gender: "Kadın",
        notes: "Ahududu, Bergamot, Heliotrope, İris, Vanilya",
        image: "/parfumler/lancome-la-vie-est-belle-intensement.jpg",
        scentFamily: "Oryantal / Çiçeksi"
    },
    {
        id: 142,
        brand: "Giorgio Armani",
        name: "Si Passione",
        gender: "Kadın",
        notes: "Siyah Frenk Üzümü, Armut, Gül, Vanilya",
        image: "/parfumler/giorgio-armani-si-passione.jpg",
        scentFamily: "Meyvemsi / Çiçeksi"
    },
    {
        id: 143,
        brand: "Giorgio Armani",
        name: "Code Femme",
        gender: "Kadın",
        notes: "Portakal Çiçeği, Zencefil, Bal, Sandal Ağacı",
        image: "/parfumler/giorgio-armani-code-femme.jpg",
        scentFamily: "Çiçeksi / Narenciye"
    },
    {
        id: 144,
        brand: "Avril Lavigne",
        name: "Forbidden Rose",
        gender: "Kadın",
        notes: "Kırmızı Elma, Şeftali, Lotus, Vanilya, Çikolata",
        image: "/parfumler/avril-lavigne-forbidden-rose.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 145,
        brand: "Shiseido",
        name: "Zen",
        gender: "Kadın",
        notes: "Greyfurt, Ananas, Frezya, Paçuli, Tütsü",
        image: "/parfumler/shiseido-zen.jpg",
        scentFamily: "Çiçeksi / Odunsu"
    },
    {
        id: 146,
        brand: "Victoria's Secret",
        name: "Bombshell Sundrenched",
        gender: "Kadın",
        notes: "Şakayık, Guava (Tropikal meyve), Sıcak Kum Notaları",
        image: "/parfumler/victorias-secret-bombshell-sundrenched.jpg",
        scentFamily: "Çiçeksi / Meyvemsi"
    },
    {
        id: 147,
        brand: "Givenchy",
        name: "L'Interdit",
        gender: "Kadın",
        notes: "Sümbülteber, Portakal Çiçeği, Yasemin, Paçuli, Vetiver",
        image: "/parfumler/givenchy-linterdit.jpg",
        scentFamily: "Çiçeksi / Odunsu"
    }
];

const publicDir = path.join(__dirname, 'public', 'parfumler');
const missingImages = [];

originals.forEach(perfume => {
    const imageName = perfume.image.split('/').pop();
    const imagePath = path.join(publicDir, imageName);

    if (!fs.existsSync(imagePath)) {
        missingImages.push(imageName);
    }
});

console.log("Eksik Görseller:");
console.log(JSON.stringify(missingImages, null, 2));
