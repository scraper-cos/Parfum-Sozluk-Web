import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = [
    {
        "id": 1,
        "brand": "Dior",
        "name": "Sauvage",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dior+Sauvage\" -\"Set\" -\"Deodorant\" -\"After\""
    },
    {
        "id": 2,
        "brand": "Chanel",
        "name": "Coco Mademoiselle",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chanel+Coco+Mademoiselle\" -\"Mist\" -\"Lotion\""
    },
    {
        "id": 3,
        "brand": "Creed",
        "name": "Aventus",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Creed+Aventus\" -\"Shower\" -\"Soap\""
    },
    {
        "id": 4,
        "brand": "Yves Saint Laurent",
        "name": "Black Opium",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"YSL+Black+Opium\" -\"Set\" -\"Lotion\""
    },
    {
        "id": 5,
        "brand": "Tom Ford",
        "name": "Black Orchid",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Tom+Ford+Black+Orchid\""
    },
    {
        "id": 6,
        "brand": "Maison Francis Kurkdjian",
        "name": "Baccarat Rouge 540",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Baccarat+Rouge+540\" -\"Refill\" -\"Cream\""
    },
    {
        "id": 7,
        "brand": "Lancôme",
        "name": "La Vie Est Belle",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Lancome+La+Vie+Est+Belle\" -\"Set\""
    },
    {
        "id": 8,
        "brand": "Paco Rabanne",
        "name": "Invictus",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Paco+Rabanne+Invictus\" -\"Deodorant\""
    },
    {
        "id": 9,
        "brand": "Victoria's Secret",
        "name": "Bombshell",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Bombshell+Parfüm\" -\"Mist\" -\"Sprey\" -\"Lotion\""
    },
    {
        "id": 10,
        "brand": "Yves Saint Laurent",
        "name": "Libre",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"YSL+Libre\" -\"Set\""
    },
    {
        "id": 11,
        "brand": "Carolina Herrera",
        "name": "Good Girl",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Carolina+Herrera+Good+Girl\" -\"Leg\" -\"Mist\""
    },
    {
        "id": 12,
        "brand": "Chanel",
        "name": "Chance Eau Tendre",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chanel+Chance+Eau+Tendre\""
    },
    {
        "id": 13,
        "brand": "Dior",
        "name": "Hypnotic Poison",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dior+Hypnotic+Poison\" -\"Deodorant\""
    },
    {
        "id": 14,
        "brand": "Chanel",
        "name": "Bleu de Chanel",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Bleu+de+Chanel\" -\"Deodorant\""
    },
    {
        "id": 15,
        "brand": "Thierry Mugler",
        "name": "Alien",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Mugler+Alien\" -\"Refillable\""
    },
    {
        "id": 16,
        "brand": "Giorgio Armani",
        "name": "Si",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Si\" -\"Passione\""
    },
    {
        "id": 17,
        "brand": "Dolce & Gabbana",
        "name": "The One",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dolce+Gabbana+The+One\""
    },
    {
        "id": 18,
        "brand": "DKNY",
        "name": "Be Delicious",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"DKNY+Be+Delicious\""
    },
    {
        "id": 19,
        "brand": "Lancôme",
        "name": "La Nuit Trésor",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Lancome+La+Nuit+Tresor\""
    },
    {
        "id": 20,
        "brand": "Tom Ford",
        "name": "Tobacco Vanille",
        "segment": "Niche_Line",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+\"Tom+Ford+Tobacco+Vanille\""
    },
    {
        "id": 21,
        "brand": "Jo Malone",
        "name": "Wood Sage & Sea Salt",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+\"Jo+Malone+Wood+Sage\" -\"Candle\" -\"Cream\""
    },
    {
        "id": 22,
        "brand": "Versace",
        "name": "Eros",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Versace+Eros\" -\"Deodorant\""
    },
    {
        "id": 23,
        "brand": "Louis Vuitton",
        "name": "Imagination",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:louisvuitton.com+\"Imagination\""
    },
    {
        "id": 24,
        "brand": "Parfums de Marly",
        "name": "Delina",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Parfums+de+Marly+Delina\" -\"Hair\""
    },
    {
        "id": 25,
        "brand": "Armani",
        "name": "Acqua di Giò",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Acqua+di+Gio\" -\"Deodorant\""
    },
    {
        "id": 26,
        "brand": "Gucci",
        "name": "Guilty Pour Homme",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Gucci+Guilty+Pour+Homme\""
    },
    {
        "id": 27,
        "brand": "Valentino",
        "name": "Uomo",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Valentino+Uomo\""
    },
    {
        "id": 28,
        "brand": "Armani",
        "name": "Stronger With You",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Stronger+With+You\""
    },
    {
        "id": 29,
        "brand": "Kenzo",
        "name": "Homme",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Kenzo+Homme\""
    },
    {
        "id": 30,
        "brand": "Hugo Boss",
        "name": "Bottled",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Hugo+Boss+Bottled\" -\"Deodorant\""
    },
    {
        "id": 31,
        "brand": "Paco Rabanne",
        "name": "Olympea",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Paco+Rabanne+Olympea\""
    },
    {
        "id": 32,
        "brand": "Jean Paul Gaultier",
        "name": "Scandal",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Jean+Paul+Gaultier+Scandal\" -\"Legs\""
    },
    {
        "id": 33,
        "brand": "Givenchy",
        "name": "Amarige",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Givenchy+Amarige\""
    },
    {
        "id": 34,
        "brand": "Armani",
        "name": "She (Lei)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+She\""
    },
    {
        "id": 35,
        "brand": "Cacharel",
        "name": "Amor Amor",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Cacharel+Amor+Amor\""
    },
    {
        "id": 36,
        "brand": "Burberry",
        "name": "Weekend",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Burberry+Weekend\""
    },
    {
        "id": 37,
        "brand": "Burberry",
        "name": "Classic",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Burberry+Classic\""
    },
    {
        "id": 38,
        "brand": "Britney Spears",
        "name": "Fantasy",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+OR+site:watsons.com.tr+\"Britney+Spears+Fantasy\""
    },
    {
        "id": 39,
        "brand": "Chanel",
        "name": "No.5",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chanel+No+5\" -\"Hair\""
    },
    {
        "id": 40,
        "brand": "Cacharel",
        "name": "Noa",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Cacharel+Noa\""
    },
    {
        "id": 41,
        "brand": "Chloé",
        "name": "Love",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chloe+Love\""
    },
    {
        "id": 42,
        "brand": "Chanel",
        "name": "Chance",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chanel+Chance\" -\"Tendre\" -\"Fraiche\""
    },
    {
        "id": 43,
        "brand": "Davidoff",
        "name": "Cool Water",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Davidoff+Cool+Water\" -\"Deodorant\""
    },
    {
        "id": 44,
        "brand": "Dior",
        "name": "Addict",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dior+Addict\""
    },
    {
        "id": 45,
        "brand": "Escada",
        "name": "Collection",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Escada\""
    },
    {
        "id": 46,
        "brand": "Armani",
        "name": "Diamonds",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Diamonds\""
    },
    {
        "id": 47,
        "brand": "Gucci",
        "name": "Rush",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Gucci+Rush\" -\"2\""
    },
    {
        "id": 48,
        "brand": "Gucci",
        "name": "Flora",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Gucci+Flora\""
    },
    {
        "id": 49,
        "brand": "Gucci",
        "name": "Guilty",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Gucci+Guilty\""
    },
    {
        "id": 50,
        "brand": "Hugo Boss",
        "name": "Deep Red",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Hugo+Boss+Deep+Red\""
    },
    {
        "id": 51,
        "brand": "Issey Miyake",
        "name": "L'eau D'issey",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Issey+Miyake+L'eau+D'issey\""
    },
    {
        "id": 52,
        "brand": "Dior",
        "name": "J'adore",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dior+J'adore\" -\"Hair\" -\"Milk\""
    },
    {
        "id": 53,
        "brand": "Jean Paul Gaultier",
        "name": "Classique",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Jean+Paul+Gaultier+Classique\""
    },
    {
        "id": 54,
        "brand": "Kenzo",
        "name": "Flower",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Kenzo+Flower\""
    },
    {
        "id": 55,
        "brand": "Kenzo",
        "name": "L'eau Par Kenzo",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"L'eau+Par+Kenzo\""
    },
    {
        "id": 56,
        "brand": "Lacoste",
        "name": "Pour Femme",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Lacoste+Pour+Femme\""
    },
    {
        "id": 57,
        "brand": "Lancôme",
        "name": "Miracle",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Lancome+Miracle\""
    },
    {
        "id": 58,
        "brand": "Lancôme",
        "name": "Hypnose",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Lancome+Hypnose\""
    },
    {
        "id": 59,
        "brand": "Lolita Lempicka",
        "name": "Lolita Lempicka",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+OR+site:sevil.com.tr+\"Lolita+Lempicka\""
    },
    {
        "id": 60,
        "brand": "Victoria's Secret",
        "name": "Dream Angels Divine",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Divine\""
    },
    {
        "id": 61,
        "brand": "Chloé",
        "name": "Chloé (Signature)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chloe+Signature\""
    },
    {
        "id": 62,
        "brand": "Jennifer Lopez",
        "name": "Glow",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+OR+site:watsons.com.tr+\"JLO+Glow\""
    },
    {
        "id": 63,
        "brand": "Jennifer Lopez",
        "name": "Still",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+OR+site:watsons.com.tr+\"JLO+Still\""
    },
    {
        "id": 64,
        "brand": "Armani",
        "name": "Acqua di Giò (Kadın)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Armani+Acqua+di+Gioia\""
    },
    {
        "id": 65,
        "brand": "Armani",
        "name": "City Glam She",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+OR+site:sevil.com.tr+\"Armani+City+Glam\""
    },
    {
        "id": 66,
        "brand": "Armani",
        "name": "Code (Kadın)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Code+Femme\""
    },
    {
        "id": 67,
        "brand": "Armani",
        "name": "Remix (Kadın)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Armani+Remix\""
    },
    {
        "id": 68,
        "brand": "Armani",
        "name": "White (Red & White)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Armani+White\""
    },
    {
        "id": 69,
        "brand": "Armani",
        "name": "Mania (Kadın)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Armani+Mania\""
    },
    {
        "id": 70,
        "brand": "Armani",
        "name": "Night (Emporio Night)",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Armani+Night\""
    },
    {
        "id": 71,
        "brand": "Armani",
        "name": "Giò",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Armani+Gio\""
    },
    {
        "id": 72,
        "brand": "Armani",
        "name": "Sensi",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Armani+Sensi\""
    },
    {
        "id": 73,
        "brand": "Ralph Lauren",
        "name": "Romance",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+\"Ralph+Lauren+Romance\""
    },
    {
        "id": 74,
        "brand": "Ralph Lauren",
        "name": "Ralph",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+\"Ralph+Lauren+Ralph\""
    },
    {
        "id": 75,
        "brand": "Ralph Lauren",
        "name": "Glamorous",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:beymen.com+\"Ralph+Lauren+Glamorous\""
    },
    {
        "id": 76,
        "brand": "Ralph Lauren",
        "name": "Hot",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:beymen.com+\"Ralph+Lauren+Hot\""
    },
    {
        "id": 77,
        "brand": "Ralph Lauren",
        "name": "Cool",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:beymen.com+\"Ralph+Lauren+Cool\""
    },
    {
        "id": 78,
        "brand": "Ralph Lauren",
        "name": "Blue",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:beymen.com+\"Ralph+Lauren+Blue\""
    },
    {
        "id": 79,
        "brand": "Ralph Lauren",
        "name": "Safari",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:beymen.com+\"Ralph+Lauren+Safari\""
    },
    {
        "id": 80,
        "brand": "Tommy Hilfiger",
        "name": "True Star",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Tommy+Hilfiger+True+Star\""
    },
    {
        "id": 81,
        "brand": "Tommy Hilfiger",
        "name": "Dreaming",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Tommy+Hilfiger+Dreaming\""
    },
    {
        "id": 82,
        "brand": "Tommy Hilfiger",
        "name": "T Girl",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Tommy+Hilfiger+T+Girl\""
    },
    {
        "id": 83,
        "brand": "Tommy Hilfiger",
        "name": "Tommy Girl",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Tommy+Girl\""
    },
    {
        "id": 84,
        "brand": "Tommy Hilfiger",
        "name": "Freedom for Her",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Tommy+Hilfiger+Freedom\""
    },
    {
        "id": 85,
        "brand": "Lacoste",
        "name": "Touch of Pink",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Lacoste+Touch+of+Pink\""
    },
    {
        "id": 86,
        "brand": "Lacoste",
        "name": "Touch of Sun",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Lacoste+Touch+of+Sun\""
    },
    {
        "id": 87,
        "brand": "Lacoste",
        "name": "Dream of Pink",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Lacoste+Dream+of+Pink\""
    },
    {
        "id": 88,
        "brand": "Lacoste",
        "name": "Love of Pink",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Lacoste+Love+of+Pink\""
    },
    {
        "id": 89,
        "brand": "Lacoste",
        "name": "Femme de Lacoste",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Femme+de+Lacoste\""
    },
    {
        "id": 90,
        "brand": "Gucci",
        "name": "Rush 2",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Gucci+Rush+2\""
    },
    {
        "id": 91,
        "brand": "Gucci",
        "name": "Gucci by Gucci",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Gucci+by+Gucci\""
    },
    {
        "id": 92,
        "brand": "Gucci",
        "name": "Eau de Parfum",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Gucci+Eau+de+Parfum\""
    },
    {
        "id": 93,
        "brand": "Gucci",
        "name": "Envy Me 2",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Gucci+Envy+Me+2\""
    },
    {
        "id": 94,
        "brand": "Gucci",
        "name": "Envy Me",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Gucci+Envy+Me\""
    },
    {
        "id": 95,
        "brand": "Gucci",
        "name": "Envy",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Gucci+Envy\""
    },
    {
        "id": 96,
        "brand": "Yves Saint Laurent",
        "name": "MYSLF",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"YSL+MYSLF\" -\"Set\" -\"Deodorant\""
    },
    {
        "id": 97,
        "brand": "Prada",
        "name": "Luna Rossa Carbon",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Prada+Luna+Rossa+Carbon\""
    },
    {
        "id": 98,
        "brand": "Jean Paul Gaultier",
        "name": "Scandal Pour Homme",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Scandal+Pour+Homme\" -\"Deodorant\""
    },
    {
        "id": 99,
        "brand": "Dolce & Gabbana",
        "name": "The One for Men",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"D&G+The+One+Men\""
    },
    {
        "id": 100,
        "brand": "Dior",
        "name": "Fahrenheit",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dior+Fahrenheit\" -\"Deodorant\" -\"After\""
    },
    {
        "id": 101,
        "brand": "Zadig & Voltaire",
        "name": "This Is Her",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Zadig+Voltaire+This+Is+Her\""
    },
    {
        "id": 102,
        "brand": "Victoria's Secret",
        "name": "Bare",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Bare+Parfüm\" -\"Mist\" -\"Lotion\""
    },
    {
        "id": 103,
        "brand": "Hugo Boss",
        "name": "The Scent Intense Her",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Hugo+Boss+The+Scent+Intense\""
    },
    {
        "id": 104,
        "brand": "Burberry",
        "name": "Her",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Burberry+Her\" -\"Elixir\""
    },
    {
        "id": 105,
        "brand": "Armani",
        "name": "My Way",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+My+Way\" -\"Refill\""
    },
    {
        "id": 106,
        "brand": "Yves Saint Laurent",
        "name": "Libre Intense",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"YSL+Libre+Intense\""
    },
    {
        "id": 107,
        "brand": "Ex Nihilo",
        "name": "Fleur Narcotique",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Ex+Nihilo+Fleur+Narcotique\""
    },
    {
        "id": 108,
        "brand": "Prada",
        "name": "Paradoxe",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Prada+Paradoxe\" -\"Refill\""
    },
    {
        "id": 109,
        "brand": "Lancôme",
        "name": "Idôle",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Lancome+Idole\" -\"Mascara\""
    },
    {
        "id": 110,
        "brand": "Emporio Armani",
        "name": "Because It’s You",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Because+Its+You\""
    },
    {
        "id": 111,
        "brand": "Versace",
        "name": "Bright Crystal",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Versace+Bright+Crystal\""
    },
    {
        "id": 112,
        "brand": "Versace",
        "name": "Crystal Noir",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Versace+Crystal+Noir\""
    },
    {
        "id": 113,
        "brand": "Dior",
        "name": "Miss Dior Blooming Bouquet",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Miss+Dior+Blooming+Bouquet\""
    },
    {
        "id": 114,
        "brand": "Tiziana Terenzi",
        "name": "Kirke",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Tiziana+Terenzi+Kirke\""
    },
    {
        "id": 115,
        "brand": "Cacharel",
        "name": "Yes I Am",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Cacharel+Yes+I+Am\""
    },
    {
        "id": 116,
        "brand": "Victoria's Secret",
        "name": "Scandalous",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Scandalous+Parfüm\" -\"Mist\""
    },
    {
        "id": 117,
        "brand": "Davidoff",
        "name": "Echo",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Davidoff+Echo\""
    },
    {
        "id": 118,
        "brand": "Paco Rabanne",
        "name": "One Million Lucky",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Paco+Rabanne+One+Million+Lucky\""
    },
    {
        "id": 119,
        "brand": "Xerjoff",
        "name": "Erba Pura",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Xerjoff+Erba+Pura\""
    },
    {
        "id": 120,
        "brand": "Jean Paul Gaultier",
        "name": "La Belle",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Jean+Paul+Gaultier+La+Belle\""
    },
    {
        "id": 121,
        "brand": "Yves Saint Laurent",
        "name": "Supreme Bouquet",
        "segment": "Niche_Line",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+\"YSL+Supreme+Bouquet\""
    },
    {
        "id": 122,
        "brand": "Amouage",
        "name": "Opus V",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Amouage+Opus+V\""
    },
    {
        "id": 123,
        "brand": "Tiziana Terenzi",
        "name": "Sirrah",
        "segment": "Niche",
        "search_url": "https://www.google.com/search?q=site:beymen.com+OR+site:makyajtrendi.com+\"Tiziana+Terenzi+Sirrah\""
    },
    {
        "id": 124,
        "brand": "Roberto Cavalli",
        "name": "Eau de Parfum",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Roberto+Cavalli+Parfum\""
    },
    {
        "id": 125,
        "brand": "Victoria's Secret",
        "name": "Tease Crème Cloud",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Tease+Creme+Cloud\" -\"Mist\""
    },
    {
        "id": 126,
        "brand": "Burberry",
        "name": "Her Elixir",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Burberry+Her+Elixir\""
    },
    {
        "id": 127,
        "brand": "Michael Kors",
        "name": "Sexy Amber",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Michael+Kors+Sexy+Amber\""
    },
    {
        "id": 128,
        "brand": "Dolce & Gabbana",
        "name": "Devotion",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Dolce+Gabbana+Devotion\""
    },
    {
        "id": 129,
        "brand": "Chloé",
        "name": "Nomade",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Chloe+Nomade\""
    },
    {
        "id": 130,
        "brand": "Jean Paul Gaultier",
        "name": "Divine",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Jean+Paul+Gaultier+Divine\""
    },
    {
        "id": 131,
        "brand": "Carolina Herrera",
        "name": "212 Sexy",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Carolina+Herrera+212+Sexy\" -\"Men\""
    },
    {
        "id": 132,
        "brand": "Givenchy",
        "name": "Absolutely Irresistible",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Givenchy+Absolutely+Irresistible\""
    },
    {
        "id": 133,
        "brand": "Calvin Klein",
        "name": "Euphoria",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:boyner.com.tr+\"Calvin+Klein+Euphoria\" -\"Men\""
    },
    {
        "id": 134,
        "brand": "Burberry",
        "name": "Goddess",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Burberry+Goddess\""
    },
    {
        "id": 135,
        "brand": "Victoria's Secret",
        "name": "Very Sexy Orchid",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Very+Sexy+Orchid\" -\"Mist\""
    },
    {
        "id": 136,
        "brand": "Versace",
        "name": "Dylan Purple",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Versace+Dylan+Purple\""
    },
    {
        "id": 137,
        "brand": "Trussardi",
        "name": "Inside For Woman",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Trussardi+Inside\""
    },
    {
        "id": 138,
        "brand": "Yves Saint Laurent",
        "name": "Black Opium Over Red",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"YSL+Black+Opium+Over+Red\""
    },
    {
        "id": 139,
        "brand": "Lancôme",
        "name": "La Vie Est Belle Intensément",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"La+Vie+Est+Belle+Intensement\""
    },
    {
        "id": 140,
        "brand": "Giorgio Armani",
        "name": "Si Passione",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Si+Passione\""
    },
    {
        "id": 141,
        "brand": "Giorgio Armani",
        "name": "Code Femme",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Armani+Code+Femme\""
    },
    {
        "id": 142,
        "brand": "Avril Lavigne",
        "name": "Forbidden Rose",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:boyner.com.tr+\"Avril+Lavigne+Forbidden+Rose\""
    },
    {
        "id": 143,
        "brand": "Shiseido",
        "name": "Zen",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Shiseido+Zen\""
    },
    {
        "id": 144,
        "brand": "Victoria's Secret",
        "name": "Bombshell Sundrenched",
        "segment": "Special_Brand",
        "search_url": "https://www.google.com/search?q=site:victoriassecret.com.tr+\"Bombshell+Sundrenched\" -\"Mist\""
    },
    {
        "id": 145,
        "brand": "Givenchy",
        "name": "L'Interdit",
        "segment": "Designer",
        "search_url": "https://www.google.com/search?q=site:sephora.com.tr+OR+site:beymen.com+OR+site:boyner.com.tr+\"Givenchy+L'Interdit\" -\"Hair\" -\"Lotion\""
    }
];

const IGNORE_TERMS = ["Set", "Deodorant", "Vücut Losyonu", "Duş Jeli", "Hair Mist", "After Shave", "Sprey", "Lotion", "Cream", "Soap", "Refill", "Yedek", "Seyahat"];

async function runScraper() {
    console.log('🚀 Starting Price Scraper (Local Mode)...');
    // Launch in non-headless mode so the user can see/interact
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();

    // Set User Agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const pricesPath = path.join(__dirname, 'prices.json');
    let scrapedData = [];
    if (fs.existsSync(pricesPath)) {
        try {
            scrapedData = JSON.parse(fs.readFileSync(pricesPath, 'utf8'));
        } catch (e) {
            console.log('⚠️ Could not parse existing prices.json, starting fresh.');
        }
    }

    // Filter out already scraped products to allow resuming
    const scrapedIds = new Set(scrapedData.map(p => p.id));
    const productsToScrape = products.filter(p => !scrapedIds.has(p.id));

    console.log(`📊 Total Products: ${products.length}`);
    console.log(`✅ Already Scraped: ${scrapedIds.size}`);
    console.log(`⏳ Remaining: ${productsToScrape.length}`);

    for (const product of productsToScrape) {
        console.log(`\n🔍 Processing (${product.id}): ${product.brand} - ${product.name}`);

        try {
            // 1. Search on DuckDuckGo
            const query = `${product.brand} ${product.name} fiyat site:sephora.com.tr`;
            const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

            await page.goto(ddgUrl, { waitUntil: 'domcontentloaded' });

            // Random delay 1-3 seconds
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

            // Extract first organic result
            const firstResult = await page.evaluate(() => {
                const anchor = document.querySelector('.result__a');
                return anchor ? anchor.href : null;
            });

            if (!firstResult) {
                console.log('❌ No search result found.');
                continue;
            }

            console.log(`🔗 Found URL: ${firstResult}`);

            // 2. Visit Product Page
            await page.goto(firstResult, { waitUntil: 'domcontentloaded' });

            // Random delay 2-4 seconds
            await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));

            const title = await page.title();
            const content = await page.content();

            // 3. Filter (Ignore Terms)
            const hasIgnoreTerm = IGNORE_TERMS.some(term => title.toLowerCase().includes(term.toLowerCase()));
            if (hasIgnoreTerm) {
                console.log(`⚠️ Ignored due to term in title: "${title}"`);
                continue;
            }

            // 4. Extract Price & Volume
            // Wait for price element to ensure it's loaded
            try {
                await page.waitForSelector('.price-sales-standard, .variation-title', { timeout: 5000 });
            } catch (e) {
                console.log('⚠️ Price element wait timed out, trying regex on content...');
            }

            const priceText = await page.evaluate(() => {
                const el = document.querySelector('.price-sales-standard') || document.querySelector('.variation-title');
                return el ? el.innerText : '';
            });

            // Fallback to content match if selector fails
            const textToSearch = priceText || content;
            const priceMatch = textToSearch.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*TL/i);

            let volumeMatch = title.match(/(\d+)\s?(ml|ML|Ml)/);

            // Try to extract volume from content if title fails
            if (!volumeMatch) {
                const volumeText = await page.evaluate(() => {
                    // Try variation buttons (selected or first)
                    const selectedVar = document.querySelector('.variation-option.is-selected');
                    if (selectedVar) return selectedVar.innerText;

                    const varBtn = document.querySelector('.variation-button');
                    if (varBtn) return varBtn.getAttribute('title') || varBtn.innerText;

                    // Try product title on page
                    const pageTitle = document.querySelector('.product-name');
                    if (pageTitle) return pageTitle.innerText;

                    // Try data attributes
                    const skuItem = document.querySelector('[data-at="sku-item-size"]');
                    if (skuItem) return skuItem.innerText;

                    return '';
                });
                if (volumeText) {
                    volumeMatch = volumeText.match(/(\d+)\s?(ml|ML|Ml)/);
                }
            }

            if (priceMatch && volumeMatch) {
                const rawPrice = priceMatch[1].replace(/\./g, '').replace(',', '.');
                const price = parseFloat(rawPrice);
                const volume = parseInt(volumeMatch[1]);
                const normalizedPrice = (price / volume) * 100;

                console.log(`✅ Data Extracted: ${price} TL / ${volume}ml -> ${normalizedPrice.toFixed(2)} TL (100ml)`);

                // Add to results
                scrapedData.push({
                    id: product.id,
                    price: parseFloat(normalizedPrice.toFixed(2)),
                    originalPrice: price,
                    originalVolume: volume,
                    productUrl: firstResult,
                    timestamp: new Date().toISOString()
                });

                // Save immediately to allow resuming
                fs.writeFileSync(pricesPath, JSON.stringify(scrapedData, null, 2));

            } else {
                console.log('❌ Extraction Failed:');
                if (!priceMatch) console.log(`   - Price not found (Text: "${textToSearch?.substring(0, 50).replace(/\n/g, ' ')}...")`);
                if (!volumeMatch) console.log(`   - Volume not found in Title ("${title}") or Content`);
            }

        } catch (e) {
            console.error(`❌ Error: ${e.message}`);
        }
    }

    console.log(`\n💾 Scraping finished! Data saved to prices.json`);
    await browser.close();
}

runScraper();
