require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const About = require('./models/aboutModel');
const Achivers = require('./models/achiversModel');
const AchiversCategory = require('./models/achiversCategoryModels');
const Banner = require('./models/bannerModel');
const BannerBottom = require('./models/bannerBottomModel');
const BloodBank = require('./models/bloodBankModel');
const BusinessNetwork = require('./models/businessNetworkModels');
const Classified = require('./models/classifiedModels');
const ClassifiedCategory = require('./models/classifiedCategoryModels');
const Donation = require('./models/donationModel');
const Event = require('./models/eventsModels');
const EventsCategory = require('./models/eventsCategoryModels');
const Gallery = require('./models/galleryModel');
const GalleryCategory = require('./models/galleryCategoryModel');
const JobApplication = require('./models/jobApplicationModel');
const JobCategory = require('./models/jobCategoryModels');
const Job = require('./models/jobsModel');
const KuldeviCategory = require('./models/kuldeviCategoryModels');
const Kuldevi = require('./models/kuldeviModels');
const Lead = require('./models/leadModel');
const Magazine = require('./models/magazineModel');
const Matrimony = require('./models/matrimonyModel');
const MatrimonyPackage = require('./models/packagesMatrimonyModel');
const News = require('./models/newsModels');
const NewsCategory = require('./models/newsCategoryModels');
const Organisation = require('./models/organisationsModel');
const Rasam = require('./models/rasamModels');
const RasamCategory = require('./models/rasamCategoryModels');
const Sponsor = require('./models/sponsorModel');
const Suggestion = require('./models/suggestionsModel');
const Volunteer = require('./models/volunteersModel');
const Vrat = require('./models/vratModel');
const VratCategory = require('./models/vratCategoryModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const populateDatabase = async () => {
    try {
        console.log('🚀 Starting Complete Database Population...\n');

        // ============ NEWS CATEGORIES ============
        console.log('📝 Populating News Categories...');
        const newsCategories = [
            { id: 1, name: 'Community News', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/community.jpg' },
            { id: 2, name: 'Cultural Events', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/culture.jpg' },
            { id: 3, name: 'Business Updates', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/business.jpg' },
            { id: 4, name: 'Social Welfare', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/welfare.jpg' },
            { id: 5, name: 'Government Schemes', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/schemes.jpg' },
            { id: 6, name: 'Agriculture', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/agriculture.jpg' },
        ];
        for (const cat of newsCategories) {
            await NewsCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ NEWS ============
        console.log('📝 Populating News...');
        const news = [
            { title: 'Kurmi Samaj Annual Conference 2025', description: 'Grand annual gathering of Kurmi community leaders', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/conference.jpg', status: 'approved' },
            { title: 'Agricultural Subsidy Update', description: 'New government schemes for farmers', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/subsidy.jpg', status: 'approved' },
            { title: 'Youth Employment Program', description: 'Skill development program for youth', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/youth.jpg', status: 'approved' },
            { title: 'Women Entrepreneurship Initiative', description: 'Supporting women-led businesses', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/women.jpg', status: 'approved' },
            { title: 'Cultural Heritage Preservation', description: 'Efforts to preserve Kurmi traditions', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/heritage.jpg', status: 'approved' },
            { title: 'Education Scholarship Announced', description: 'Merit-based scholarships for students', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/news/education.jpg', status: 'approved' },
        ];
        for (const item of news) {
            await News.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }

        // ============ EVENTS CATEGORIES ============
        console.log('📝 Populating Events Categories...');
        const eventCategories = [
            { id: 1, name: 'Cultural Festival', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/festival.jpg' },
            { id: 2, name: 'Business Meet', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/business.jpg' },
            { id: 3, name: 'Religious', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/religious.jpg' },
            { id: 4, name: 'Educational', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/education.jpg' },
            { id: 5, name: 'Social Gathering', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/social.jpg' },
            { id: 6, name: 'Sports Event', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/sports.jpg' },
        ];
        for (const cat of eventCategories) {
            await EventsCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ EVENTS ============
        console.log('📝 Populating Events...');
        const events = [
            { title: 'Holi Celebration 2025', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/holi.jpg', description: 'Grand Holi celebration', city: 'Delhi', status: 'approved' },
            { title: 'Diwali Fair', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/diwali.jpg', description: 'Festival fair with cultural programs', city: 'Agra' , status: 'approved' },
            { title: 'Community Sports', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/sports.jpg', description: 'Annual sports tournament', city: 'Kanpur', status: 'approved' },
            { title: 'Youth Leadership Summit', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/summit.jpg', description: 'Leadership training program', city: 'Mumbai', status: 'approved' },
            { title: 'Business Expo', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/expo.jpg', description: 'Business opportunities showcase', city: 'Bangalore', status: 'approved' },
            { title: 'Cultural Night', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/events/cultural.jpg', description: 'Traditional music and dance', city: 'Chennai', status: 'approved' },
        ];
        for (const event of events) {
            await Event.findOneAndUpdate({ title: event.title }, event, { upsert: true });
        }

        // ============ JOB CATEGORIES ============
        console.log('📝 Populating Job Categories...');
        const jobCategories = [
            { id: 1, name: 'IT & Software', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/it.jpg' },
            { id: 2, name: 'Agriculture', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/agriculture.jpg' },
            { id: 3, name: 'Business & Trade', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/business.jpg' },
            { id: 4, name: 'Education', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/education.jpg' },
            { id: 5, name: 'Healthcare', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/healthcare.jpg' },
            { id: 6, name: 'Manufacturing', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/manufacturing.jpg' },
        ];
        for (const cat of jobCategories) {
            await JobCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ JOBS ============
        console.log('📝 Populating Jobs...');
        const jobs = [
            { title: 'Senior Developer', description: 'React and Node.js expertise required', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/dev.jpg', status: 'approved' },
            { title: 'Agricultural Consultant', description: 'Modern farming techniques', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/agri.jpg', status: 'approved' },
            { title: 'Business Manager', description: 'Manage business operations', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/manager.jpg', status: 'approved' },
            { title: 'Teacher', description: 'Mathematics and Science', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/teacher.jpg', status: 'approved' },
            { title: 'Healthcare Professional', description: 'Medical consultant needed', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/health.jpg', status: 'approved' },
            { title: 'Production Head', description: 'Manufacturing unit management', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/jobs/production.jpg', status: 'approved' },
        ];
        for (const job of jobs) {
            await Job.findOneAndUpdate({ title: job.title }, job, { upsert: true });
        }

        // ============ CLASSIFIED CATEGORIES ============
        console.log('📝 Populating Classified Categories...');
        const classifiedCategories = [
            { id: 1, name: 'Real Estate', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/realestate.jpg' },
            { id: 2, name: 'Vehicles', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/vehicles.jpg' },
            { id: 3, name: 'Electronics', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/electronics.jpg' },
            { id: 4, name: 'Machinery', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/machinery.jpg' },
            { id: 5, name: 'Services', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/services.jpg' },
            { id: 6, name: 'Miscellaneous', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/misc.jpg' },
        ];
        for (const cat of classifiedCategories) {
            await ClassifiedCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ CLASSIFIEDS ============
        console.log('📝 Populating Classifieds...');
        const classifieds = [
            { title: 'Agricultural Land for Sale', description: '5 acres fertile land', price: '500000', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/land.jpg', status: 'approved' },
            { title: 'Tractor on Sale', description: 'John Deere tractor, 5 years old', price: '350000', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/tractor.jpg', status: 'approved' },
            { title: 'Farm Equipment', description: 'Complete set of farming tools', price: '50000', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/equipment.jpg', status: 'approved' },
            { title: 'Warehouse Space', description: 'Warehouse for business', price: '200000', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/warehouse.jpg', status: 'approved' },
            { title: 'Commercial Vehicle', description: 'Truck for logistics', price: '400000', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/truck.jpg', status: 'approved' },
            { title: 'Solar Equipment', description: 'Solar panels and batteries', price: '100000', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/classified/solar.jpg', status: 'approved' },
        ];
        for (const item of classifieds) {
            await Classified.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }

        // ============ RASAM CATEGORIES ============
        console.log('📝 Populating Rasam Categories...');
        const rasamCategories = [
            { id: 1, name: 'Traditional Recipes', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/traditional.jpg' },
            { id: 2, name: 'Festival Recipes', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/festival.jpg' },
            { id: 3, name: 'Health Recipes', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/health.jpg' },
        ];
        for (const cat of rasamCategories) {
            await RasamCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ RASAMS ============
        console.log('📝 Populating Rasams...');
        const categoryMap = {};
        const cats = await RasamCategory.find();
        cats.forEach(cat => categoryMap[cat.name] = cat._id);

        const rasams = [
            { title: 'Sambar Rasam', description: 'Traditional South Indian sambar rasam', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/sambar.jpg', city: 'Chennai', category: categoryMap['Traditional Recipes'] },
            { title: 'Tomato Rasam', description: 'Tangy tomato-based rasam', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/tomato.jpg', city: 'Bangalore', category: categoryMap['Traditional Recipes'] },
            { title: 'Diwali Special Rasam', description: 'Festival special recipe', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/diwali.jpg', city: 'Delhi', category: categoryMap['Festival Recipes'] },
            { title: 'Holi Rasam', description: 'Spring festival recipe', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/holi.jpg', city: 'Agra', category: categoryMap['Festival Recipes'] },
            { title: 'Ayurvedic Rasam', description: 'Health-boosting rasam', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/ayurvedic.jpg', city: 'Varanasi', category: categoryMap['Health Recipes'] },
            { title: 'Immunity Rasam', description: 'Strengthen immunity naturally', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/rasam/immunity.jpg', city: 'Pune', category: categoryMap['Health Recipes'] },
        ];
        for (const rasam of rasams) {
            await Rasam.findOneAndUpdate({ title: rasam.title }, rasam, { upsert: true });
        }

        // ============ GALLERY CATEGORIES ============
        console.log('📝 Populating Gallery Categories...');
        const galleryCategories = [
            { id: 1, name: 'Community Events', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/events.jpg' },
            { id: 2, name: 'Cultural Programs', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/cultural.jpg' },
            { id: 3, name: 'Festivals', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/festivals.jpg' },
            { id: 4, name: 'Business Initiatives', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/business.jpg' },
            { id: 5, name: 'Educational Programs', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/education.jpg' },
            { id: 6, name: 'Social Welfare', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/welfare.jpg' },
        ];
        for (const cat of galleryCategories) {
            await GalleryCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ GALLERIES ============
        console.log('📝 Populating Galleries...');
        const galleries = [
            { title: 'Diwali 2024 Celebration', description: 'Grand diwali event photos', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/diwali2024.jpg', category: galleryCategories[2].name },
            { title: 'Holi Festival Fun', description: 'Color and joy of Holi', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/holi_fun.jpg', category: galleryCategories[2].name },
            { title: 'Community Dinner', description: 'Annual community gathering', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/dinner.jpg', category: galleryCategories[0].name },
            { title: 'Cultural Program 2025', description: 'Traditional performances', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/cultural.jpg', category: galleryCategories[1].name },
            { title: 'Youth Training', description: 'Educational workshop', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/training.jpg', category: galleryCategories[4].name },
            { title: 'Charity Drive', description: 'Community welfare initiative', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/gallery/charity.jpg', category: galleryCategories[5].name },
        ];
        for (const gallery of galleries) {
            await Gallery.findOneAndUpdate({ title: gallery.title }, gallery, { upsert: true });
        }

        // ============ ACHIVERS CATEGORIES ============
        console.log('📝 Populating Achivers Categories...');
        const achiversCategories = [
            { id: 1, name: 'Business Leaders', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/business.jpg' },
            { id: 2, name: 'Educators', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/educator.jpg' },
            { id: 3, name: 'Social Workers', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/social.jpg' },
            { id: 4, name: 'Sports Champions', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/sports.jpg' },
            { id: 5, name: 'Artists & Cultural Icons', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/artist.jpg' },
            { id: 6, name: 'Farmers & Innovators', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/farmer.jpg' },
        ];
        for (const cat of achiversCategories) {
            await AchiversCategory.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
        }

        // ============ ACHIVERS ============
        console.log('📝 Populating Achivers...');
        const achivers = [
            { title: 'Rajesh Kumar - Business Magnate', description: 'Built a multi-million dollar business empire', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/rajesh.jpg', status: 'approved' },
            { title: 'Priya Sharma - Educator', description: 'Pioneering education for rural areas', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/priya.jpg', status: 'approved' },
            { title: 'Amit Singh - Social Worker', description: 'Dedicated to community welfare', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/amit.jpg', status: 'approved' },
            { title: 'Anita Devi - Sports Champion', description: 'National level athlete', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/anita.jpg', status: 'approved' },
            { title: 'Vikram Kumar - Artist', description: 'Renowned cultural performer', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/vikram.jpg', status: 'approved' },
            { title: 'Suresh Yadav - Farmer Innovator', description: 'Modern agricultural techniques', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/achivers/suresh.jpg', status: 'approved' },
        ];
        for (const achiver of achivers) {
            await Achivers.findOneAndUpdate({ title: achiver.title }, achiver, { upsert: true });
        }

        // ============ MAGAZINES ============
        console.log('📝 Populating Magazines...');
        const magazines = [
            { title: 'Kurmi Samaj Monthly', description: 'Monthly magazine', pdf: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/kurmi_monthly.pdf', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cover1.jpg' },
            { title: 'Agriculture Journal', description: 'Farming techniques and tips', pdf: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/agri.pdf', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cover2.jpg' },
            { title: 'Business Digest', description: 'Business opportunities', pdf: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/business.pdf', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cover3.jpg' },
            { title: 'Youth Magazine', description: 'For youth development', pdf: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/youth.pdf', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cover4.jpg' },
            { title: 'Cultural Quarterly', description: 'Cultural heritage', pdf: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cultural.pdf', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cover5.jpg' },
            { title: 'Education Times', description: 'Educational updates', pdf: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/education.pdf', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/magazines/cover6.jpg' },
        ];
        for (const mag of magazines) {
            await Magazine.findOneAndUpdate({ title: mag.title }, mag, { upsert: true });
        }

        // ============ DONATIONS ============
        console.log('📝 Populating Donations...');
        const donations = [
            { title: 'Community Welfare Fund', description: 'Help underprivileged families', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/donations/welfare.jpg', status: 'approved' },
            { title: 'Education for All', description: 'Scholarship program', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/donations/education.jpg', status: 'approved' },
            { title: 'Agricultural Support', description: 'Help struggling farmers', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/donations/agri.jpg', status: 'approved' },
            { title: 'Healthcare Initiative', description: 'Medical camps and aid', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/donations/health.jpg', status: 'approved' },
            { title: 'Disaster Relief', description: 'Help in natural disasters', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/donations/disaster.jpg', status: 'approved' },
            { title: 'Women Empowerment', description: 'Support women entrepreneurs', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/donations/women.jpg', status: 'approved' },
        ];
        for (const donation of donations) {
            await Donation.findOneAndUpdate({ title: donation.title }, donation, { upsert: true });
        }

        // ============ VOLUNTEERS ============
        console.log('📝 Populating Volunteers...');
        const volunteers = [
            { title: 'Community Service Volunteers', description: 'Help in community events', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/volunteers/community.jpg' },
            { title: 'Educational Mentors', description: 'Mentor students', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/volunteers/mentor.jpg' },
            { title: 'Healthcare Volunteers', description: 'Assist in medical camps', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/volunteers/health.jpg' },
            { title: 'Cultural Ambassadors', description: 'Promote cultural programs', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/volunteers/cultural.jpg' },
            { title: 'Environmental Activists', description: 'Environmental conservation', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/volunteers/environment.jpg' },
            { title: 'Youth Leaders', description: 'Lead youth programs', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/volunteers/youth.jpg' },
        ];
        for (const vol of volunteers) {
            await Volunteer.findOneAndUpdate({ title: vol.title }, vol, { upsert: true });
        }

        // ============ SPONSORS ============
        console.log('📝 Populating Sponsors...');
        const sponsors = [
            { title: 'Premium Business Sponsor', description: 'Sponsor business events', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/sponsors/business.jpg', price: 100000, status: 'approved' },
            { title: 'Cultural Sponsor', description: 'Sponsor cultural programs', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/sponsors/cultural.jpg', price: 75000, status: 'approved' },
            { title: 'Educational Sponsor', description: 'Sponsor education initiatives', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/sponsors/education.jpg', price: 60000, status: 'approved' },
            { title: 'Healthcare Sponsor', description: 'Sponsor medical camps', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/sponsors/healthcare.jpg', price: 80000, status: 'approved' },
            { title: 'Sports Sponsor', description: 'Sponsor sports events', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/sponsors/sports.jpg', price: 70000, status: 'approved' },
            { title: 'Community Sponsor', description: 'General community support', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/sponsors/community.jpg', price: 50000, status: 'approved' },
        ];
        for (const sponsor of sponsors) {
            await Sponsor.findOneAndUpdate({ title: sponsor.title }, sponsor, { upsert: true });
        }

        // ============ ORGANISATIONS ============
        console.log('📝 Populating Organisations...');
        const organisations = [
            { title: 'Kurmi Samaj Association', description: 'Community association', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/orgs/ksa.jpg', status: 'approved' },
            { title: 'Farmers Union', description: 'Agricultural cooperative', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/orgs/farmers.jpg', status: 'approved' },
            { title: 'Business Council', description: 'Business development body', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/orgs/business.jpg', status: 'approved' },
            { title: 'Youth Development Center', description: 'Youth training organization', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/orgs/youth.jpg', status: 'approved' },
            { title: 'Cultural Foundation', description: 'Cultural preservation org', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/orgs/culture.jpg', status: 'approved' },
            { title: 'Social Welfare Trust', description: 'Welfare organization', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/orgs/welfare.jpg', status: 'approved' },
        ];
        for (const org of organisations) {
            await Organisation.findOneAndUpdate({ title: org.title }, org, { upsert: true });
        }

        // ============ SUGGESTIONS ============
        console.log('📝 Populating Suggestions...');
        const suggestions = [
            { title: 'Improve Community Portal', description: 'Better user interface needed', email: 'user1@example.com', phone: '9876543210', status: 'pending' },
            { title: 'Add More Job Listings', description: 'Need more job opportunities', email: 'user2@example.com', phone: '9876543211', status: 'pending' },
            { title: 'Digital Payment Options', description: 'Accept online payments', email: 'user3@example.com', phone: '9876543212', status: 'pending' },
            { title: 'Mobile App Development', description: 'Create a mobile application', email: 'user4@example.com', phone: '9876543213', status: 'pending' },
            { title: 'Video Content Library', description: 'Add video tutorials', email: 'user5@example.com', phone: '9876543214', status: 'pending' },
            { title: 'Certification Program', description: 'Add skill certification', email: 'user6@example.com', phone: '9876543215', status: 'pending' },
        ];
        for (const sugg of suggestions) {
            await Suggestion.findOneAndUpdate({ title: sugg.title }, sugg, { upsert: true });
        }

        // ============ BLOOD BANKS ============
        console.log('📝 Populating Blood Banks...');
        const bloodBanks = [
            { name: 'Central Blood Bank Delhi', city: 'Delhi', state: 'Delhi', phone: '9876543210', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/blood/delhi.jpg' },
            { name: 'Red Cross Blood Bank Agra', city: 'Agra', state: 'Uttar Pradesh', phone: '9876543211', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/blood/agra.jpg' },
            { name: 'City Blood Bank Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', phone: '9876543212', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/blood/kanpur.jpg' },
            { name: 'Life Blood Bank Mumbai', city: 'Mumbai', state: 'Maharashtra', phone: '9876543213', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/blood/mumbai.jpg' },
            { name: 'Heart Beat Blood Bank Bangalore', city: 'Bangalore', state: 'Karnataka', phone: '9876543214', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/blood/bangalore.jpg' },
            { name: 'Hope Blood Bank Chennai', city: 'Chennai', state: 'Tamil Nadu', phone: '9876543215', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/blood/chennai.jpg' },
        ];
        for (const bank of bloodBanks) {
            await BloodBank.findOneAndUpdate({ name: bank.name }, bank, { upsert: true });
        }

        // ============ ABOUT ============
        console.log('📝 Populating About...');
        const about = [
            { title: 'About Kurmi Samaj', description: 'The Kurmi Samaj is a unified community of the Kurmi caste with rich cultural heritage', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/about/kurmi.jpg' },
            { title: 'Our Mission', description: 'To empower and unite the Kurmi community through education and economic development', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/about/mission.jpg' },
            { title: 'Heritage & Culture', description: 'Preserving traditional values while embracing modern progress', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/about/heritage.jpg' },
            { title: 'Community Services', description: 'Providing education, healthcare, and social welfare to community members', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/about/services.jpg' },
            { title: 'Success Stories', description: 'Inspiring examples of community members who achieved great success', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/about/stories.jpg' },
            { title: 'Join Us', description: 'Be part of our growing community and contribute to its development', image: 'https://dummy-bucket.blr1.digitaloceanspaces.com/about/join.jpg' },
        ];
        for (const item of about) {
            await About.findOneAndUpdate({ title: item.title }, item, { upsert: true });
        }

        console.log('\n✅ Database Population Complete!\n');
        console.log('📊 Summary:');
        console.log('   ✓ News Categories: 6');
        console.log('   ✓ News: 6');
        console.log('   ✓ Events Categories: 6');
        console.log('   ✓ Events: 6');
        console.log('   ✓ Job Categories: 6');
        console.log('   ✓ Jobs: 6');
        console.log('   ✓ Classified Categories: 6');
        console.log('   ✓ Classifieds: 6');
        console.log('   ✓ Rasam Categories: 3');
        console.log('   ✓ Rasams: 6');
        console.log('   ✓ Gallery Categories: 6');
        console.log('   ✓ Galleries: 6');
        console.log('   ✓ Achivers Categories: 6');
        console.log('   ✓ Achivers: 6');
        console.log('   ✓ Magazines: 6');
        console.log('   ✓ Donations: 6');
        console.log('   ✓ Volunteers: 6');
        console.log('   ✓ Sponsors: 6');
        console.log('   ✓ Organisations: 6');
        console.log('   ✓ Suggestions: 6');
        console.log('   ✓ Blood Banks: 6');
        console.log('   ✓ About: 6\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error populating database:', error);
        process.exit(1);
    }
};

populateDatabase();
