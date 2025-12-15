require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const VratCategory = require('./models/vratCategoryModel');
const VratSubCategory = require('./models/vratSubCategoryModel');
const VratSubSubCategory = require('./models/vratSubSubCategoryModel');
const Vrat = require('./models/vratModel');
const KuldeviCategory = require('./models/kuldeviCategoryModels');
const Kuldevi = require('./models/kuldeviModels');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const seedKurmiData = async () => {
    try {
        console.log('🌾 Starting Kurmi Samaj Festival Seeding...');

        // ============ VRAT CATEGORIES ============
        const vratCategories = [
            { id: 1, name: 'Monthly Vrats', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/monthly.jpg' },
            { id: 2, name: 'Seasonal Vrats', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/seasonal.jpg' },
            { id: 3, name: 'Deity Specific Vrats', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/deity.jpg' },
            { id: 4, name: 'Agricultural Festivals', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/agricultural.jpg' },
        ];

        console.log('📝 Inserting Vrat Categories...');
        for (const cat of vratCategories) {
            await VratCategory.findOneAndUpdate(
                { id: cat.id },
                cat,
                { upsert: true, new: true }
            );
        }

        // ============ KULDEVI CATEGORIES ============
        const kuldeviCategories = [
            { id: 1, name: 'Village Kuldevies', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/village.jpg', description: 'Village protecting goddesses' },
            { id: 2, name: 'Family Kuldevies', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/family.jpg', description: 'Family protecting deities' },
            { id: 3, name: 'Kurmi Community Kuldevies', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/kurmi.jpg', description: 'Kuldevies worshipped by Kurmi community' },
        ];

        console.log('📝 Inserting Kuldevi Categories...');
        const culdeviCatIds = {};
        for (const cat of kuldeviCategories) {
            const result = await KuldeviCategory.findOneAndUpdate(
                { id: cat.id },
                cat,
                { upsert: true, new: true }
            );
            culdeviCatIds[cat.name] = result._id;
        }

        // ============ VRATS/FASTS ============
        const vrats = [
            // Monthly Vrats
            {
                id: 101,
                title: 'Amavasya (New Moon) Fast',
                category: 1,
                description: 'Monthly fast observed on the new moon day. Devotees fast and worship household deities.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/amavasya.jpg'
            },
            {
                id: 102,
                title: 'Poornima (Full Moon) Fast',
                category: 1,
                description: 'Monthly fast observed on the full moon day. Important day for spiritual practices.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/poornima.jpg'
            },
            {
                id: 103,
                title: 'Ekadashi Fast',
                category: 1,
                description: 'Fast observed on the 11th day of lunar fortnight. Important for devotion to Lord Krishna.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/ekadashi.jpg'
            },

            // Seasonal/Annual Festivals
            {
                id: 201,
                title: 'Makar Sankranti',
                category: 2,
                description: 'Winter harvest festival celebrated with joy and feasts. Kurmi community celebrates with traditional sweets and community gatherings.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/makar_sankranti.jpg'
            },
            {
                id: 202,
                title: 'Basant Panchami',
                category: 2,
                description: 'Spring festival marking the beginning of spring season. Goddess Saraswati is worshipped.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/basant.jpg'
            },
            {
                id: 203,
                title: 'Holi',
                category: 2,
                description: 'Festival of colors and joy. Celebrates the victory of good over evil. Major festival for Kurmi community.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/holi.jpg'
            },
            {
                id: 204,
                title: 'Navratri',
                category: 2,
                description: '9-day festival honoring Goddess Durga. Celebrated with fasting, prayers, and Garba dances.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/navratri.jpg'
            },
            {
                id: 205,
                title: 'Dussehra',
                category: 2,
                description: 'Victory of good over evil. Celebrates the triumph of Lord Rama over Ravana.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/dussehra.jpg'
            },
            {
                id: 206,
                title: 'Diwali',
                category: 2,
                description: 'Festival of lights. Celebrates the victory of light over darkness. Major celebration in Kurmi households.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/diwali.jpg'
            },
            {
                id: 207,
                title: 'Chhath Puja',
                category: 2,
                description: 'Ancient agricultural festival dedicated to Sun God. Celebrated with great fervor in Bihar and Eastern UP.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/chhath.jpg'
            },

            // Deity Specific
            {
                id: 301,
                title: 'Krishna Janmashtami',
                category: 3,
                description: 'Birth of Lord Krishna. Fasting and celebrations throughout the day and night.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/krishna.jpg'
            },
            {
                id: 302,
                title: 'Durga Puja',
                category: 3,
                description: 'Worship of Mother Durga in various forms during Navratri.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/durga.jpg'
            },
            {
                id: 303,
                title: 'Shiva Ratri',
                category: 3,
                description: 'Night of Lord Shiva. Devotees stay awake and worship throughout the night.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/shiva.jpg'
            },

            // Agricultural Festivals
            {
                id: 401,
                title: 'Baisakhi',
                category: 4,
                description: 'Harvest festival marking the beginning of the new agricultural year. Kurmi farmers celebrate with joy.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/baisakhi.jpg'
            },
            {
                id: 402,
                title: 'Lohri',
                category: 4,
                description: 'Winter harvest festival celebrated a day before Makar Sankranti. Marked by bonfires and feasting.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/lohri.jpg'
            },
            {
                id: 403,
                title: 'Pongal',
                category: 4,
                description: 'South Indian harvest festival. Celebrated with thanksgiving to sun and nature.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/vrat/pongal.jpg'
            },
        ];

        console.log('📝 Inserting Vrats...');
        for (const vrat of vrats) {
            await Vrat.findOneAndUpdate(
                { id: vrat.id },
                vrat,
                { upsert: true, new: true }
            );
        }

        // ============ KULDEVIES (Community Goddesses) ============
        const kuldevies = [
            {
                title: 'Devi Durga',
                description: 'Primary Kuldevi of many Kurmi communities. Protector against evil and provider of prosperity.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/durga.jpg',
                state: 'Bihar',
                city: 'Arrah',
                category: culdeviCatIds['Kurmi Community Kuldevies']
            },
            {
                title: 'Devi Kali',
                description: 'Fierce form of goddess, worshipped for protection and destruction of negativity.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/kali.jpg',
                state: 'West Bengal',
                city: 'Kolkata',
                category: culdeviCatIds['Kurmi Community Kuldevies']
            },
            {
                title: 'Devi Saraswati',
                description: 'Goddess of knowledge and wisdom. Worshipped for education and learning.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/saraswati.jpg',
                state: 'Uttar Pradesh',
                city: 'Varanasi',
                category: culdeviCatIds['Kurmi Community Kuldevies']
            },
            {
                title: 'Devi Lakshmi',
                description: 'Goddess of wealth and prosperity. Essential deity for business and agricultural prosperity.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/lakshmi.jpg',
                state: 'Bihar',
                city: 'Madhubani',
                category: culdeviCatIds['Kurmi Community Kuldevies']
            },
            {
                title: 'Devi Parvati',
                description: 'Goddess of fertility and nurture. Protector of families and households.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/parvati.jpg',
                state: 'Himachal Pradesh',
                city: 'Shimla',
                category: culdeviCatIds['Kurmi Community Kuldevies']
            },
            {
                title: 'Gauri Mata',
                description: 'Golden mother goddess. Worshipped for family welfare and prosperity.',
                image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/kuldevi/gauri.jpg',
                state: 'Madhya Pradesh',
                city: 'Indore',
                category: culdeviCatIds['Kurmi Community Kuldevies']
            },
        ];

        console.log('📝 Inserting Kuldevies...');
        for (const kuldevi of kuldevies) {
            await Kuldevi.findOneAndUpdate(
                { title: kuldevi.title },
                kuldevi,
                { upsert: true, new: true }
            );
        }

        console.log('\n✅ Kurmi Samaj Festival Data Seeded Successfully!\n');
        console.log('📊 Summary:');
        console.log(`   ✓ Vrat Categories: ${vratCategories.length}`);
        console.log(`   ✓ Vrats/Fasts: ${vrats.length}`);
        console.log(`   ✓ Kuldevi Categories: ${kuldeviCategories.length}`);
        console.log(`   ✓ Kuldevies: ${kuldevies.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedKurmiData();
