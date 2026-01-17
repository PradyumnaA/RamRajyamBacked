require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/userModels');
const News = require('./models/newsModels');
const NewsCategory = require('./models/newsCategoryModels');
const Event = require('./models/eventsModels');
const EventsCategory = require('./models/eventsCategoryModels');
const Job = require('./models/jobsModel');
const JobCategory = require('./models/jobCategoryModels');
const Classified = require('./models/classifiedModels');
const ClassifiedCategory = require('./models/classifiedCategoryModels');
const Gallery = require('./models/galleryModel');
const GalleryCategory = require('./models/galleryCategoryModel');
const Achivers = require('./models/achiversModel');
const AchiversCategory = require('./models/achiversCategoryModels');
const Rasam = require('./models/rasamModels');
const RasamCategory = require('./models/rasamCategoryModels');
const Magazine = require('./models/magazineModel');
const Donation = require('./models/donationModel');
const Volunteer = require('./models/volunteersModel');
const Sponsor = require('./models/sponsorModel');
const Organisation = require('./models/organisationsModel');
const Suggestion = require('./models/suggestionsModel');
const BloodBank = require('./models/bloodBankModel');
const About = require('./models/aboutModel');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const populateDatabase = async () => {
    try {
        console.log('🚀 Starting Clean Database Population...\n');

        const collections = [
            'categories', 'news', 'newscategories', 'events', 'eventscategories', 'jobs', 'jobcategories', 
            'classifieds', 'classifiedcategories', 'rasams', 'rasamcategories', 'galleries', 'gallerycategories',
            'achivers', 'archiverscategories', 'magazines', 'donations', 'volunteers', 'sponsors', 
            'organisations', 'suggestions', 'bloodbanks', 'abouts'
        ];

        console.log('🧹 Clearing collections...');
        for (const collName of collections) {
            try {
                await mongoose.connection.collection(collName).drop();
                console.log(`   ✓ ${collName}`);
            } catch (err) {
                // Ignore
            }
        }

        console.log('\n👤 Creating Admin User...');
        let admin = await User.findOne({ email: 'admin@admin.com' });
        if (!admin) {
            admin = await User.create({
                email: 'admin@admin.com',
                password: 'Admin@123',
                fullName: 'Admin User',
                contactNo: '9999999999',
                role: 'admin',
                city: 'Delhi'
            });
        }
        const adminId = admin._id;
        console.log(`   ✓ Admin ready`);

        // NEWS CATEGORIES
        console.log('\n📝 News Categories...');
        await NewsCategory.insertMany([
            { id: 'ncat_a1', name: 'Community News', image: 'https://dummy.com/1.jpg' },
            { id: 'ncat_a2', name: 'Cultural Events', image: 'https://dummy.com/2.jpg' },
            { id: 'ncat_a3', name: 'Business', image: 'https://dummy.com/3.jpg' },
            { id: 'ncat_a4', name: 'Welfare', image: 'https://dummy.com/4.jpg' },
            { id: 'ncat_a5', name: 'Government', image: 'https://dummy.com/5.jpg' },
            { id: 'ncat_a6', name: 'Agriculture', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 categories');

        // NEWS
        console.log('📝 News...');
        const newsCat = await NewsCategory.findOne({ id: 'ncat_a1' });
        await News.insertMany([
            { id: 'news_a1', title: 'News 1', category: newsCat._id, description: 'Desc 1', image: 'https://dummy.com/1.jpg', city: 'Delhi', createdBy: adminId, status: 'approved' },
            { id: 'news_a2', title: 'News 2', category: newsCat._id, description: 'Desc 2', image: 'https://dummy.com/2.jpg', city: 'Agra', createdBy: adminId, status: 'approved' },
            { id: 'news_a3', title: 'News 3', category: newsCat._id, description: 'Desc 3', image: 'https://dummy.com/3.jpg', city: 'Kanpur', createdBy: adminId, status: 'approved' },
            { id: 'news_a4', title: 'News 4', category: newsCat._id, description: 'Desc 4', image: 'https://dummy.com/4.jpg', city: 'Mumbai', createdBy: adminId, status: 'approved' },
            { id: 'news_a5', title: 'News 5', category: newsCat._id, description: 'Desc 5', image: 'https://dummy.com/5.jpg', city: 'Bangalore', createdBy: adminId, status: 'approved' },
            { id: 'news_a6', title: 'News 6', category: newsCat._id, description: 'Desc 6', image: 'https://dummy.com/6.jpg', city: 'Chennai', createdBy: adminId, status: 'approved' },
        ]);
        console.log('   ✓ 6 items');

        // EVENT CATEGORIES
        console.log('📝 Event Categories...');
        await EventsCategory.insertMany([
            { id: 'ecat_b1', name: 'Festival', image: 'https://dummy.com/1.jpg' },
            { id: 'ecat_b2', name: 'Business', image: 'https://dummy.com/2.jpg' },
            { id: 'ecat_b3', name: 'Religious', image: 'https://dummy.com/3.jpg' },
            { id: 'ecat_b4', name: 'Educational', image: 'https://dummy.com/4.jpg' },
            { id: 'ecat_b5', name: 'Social', image: 'https://dummy.com/5.jpg' },
            { id: 'ecat_b6', name: 'Sports', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 categories');

        // EVENTS
        console.log('📝 Events...');
        const eventsCat = await EventsCategory.findOne({ id: 'ecat_b1' });
        await Event.insertMany([
            { id: 'evt_b1', title: 'Event 1', category: eventsCat._id, description: 'Desc 1', image: 'https://dummy.com/1.jpg', city: 'Delhi', createdBy: adminId, status: 'approved' },
            { id: 'evt_b2', title: 'Event 2', category: eventsCat._id, description: 'Desc 2', image: 'https://dummy.com/2.jpg', city: 'Agra', createdBy: adminId, status: 'approved' },
            { id: 'evt_b3', title: 'Event 3', category: eventsCat._id, description: 'Desc 3', image: 'https://dummy.com/3.jpg', city: 'Kanpur', createdBy: adminId, status: 'approved' },
            { id: 'evt_b4', title: 'Event 4', category: eventsCat._id, description: 'Desc 4', image: 'https://dummy.com/4.jpg', city: 'Mumbai', createdBy: adminId, status: 'approved' },
            { id: 'evt_b5', title: 'Event 5', category: eventsCat._id, description: 'Desc 5', image: 'https://dummy.com/5.jpg', city: 'Bangalore', createdBy: adminId, status: 'approved' },
            { id: 'evt_b6', title: 'Event 6', category: eventsCat._id, description: 'Desc 6', image: 'https://dummy.com/6.jpg', city: 'Chennai', createdBy: adminId, status: 'approved' },
        ]);
        console.log('   ✓ 6 items');

        // JOB CATEGORIES
        console.log('📝 Job Categories...');
        await JobCategory.insertMany([
            { id: 'jcat_c1', name: 'IT', image: 'https://dummy.com/1.jpg' },
            { id: 'jcat_c2', name: 'Agriculture', image: 'https://dummy.com/2.jpg' },
            { id: 'jcat_c3', name: 'Business', image: 'https://dummy.com/3.jpg' },
            { id: 'jcat_c4', name: 'Education', image: 'https://dummy.com/4.jpg' },
            { id: 'jcat_c5', name: 'Healthcare', image: 'https://dummy.com/5.jpg' },
            { id: 'jcat_c6', name: 'Manufacturing', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 categories');

        // JOBS
        console.log('📝 Jobs...');
        const jobCat = await JobCategory.findOne({ id: 'jcat_c1' });
        await Job.insertMany([
            { id: 'job_c1', title: 'Job 1', category: jobCat._id, description: 'Desc 1', image: 'https://dummy.com/1.jpg', city: 'Delhi', createdBy: adminId, companyName: 'Company 1', address: 'Address 1', pincode: '110001', salary: '50000', status: 'approved' },
            { id: 'job_c2', title: 'Job 2', category: jobCat._id, description: 'Desc 2', image: 'https://dummy.com/2.jpg', city: 'Agra', createdBy: adminId, companyName: 'Company 2', address: 'Address 2', pincode: '282001', salary: '60000', status: 'approved' },
            { id: 'job_c3', title: 'Job 3', category: jobCat._id, description: 'Desc 3', image: 'https://dummy.com/3.jpg', city: 'Kanpur', createdBy: adminId, companyName: 'Company 3', address: 'Address 3', pincode: '208001', salary: '70000', status: 'approved' },
            { id: 'job_c4', title: 'Job 4', category: jobCat._id, description: 'Desc 4', image: 'https://dummy.com/4.jpg', city: 'Mumbai', createdBy: adminId, companyName: 'Company 4', address: 'Address 4', pincode: '400001', salary: '80000', status: 'approved' },
            { id: 'job_c5', title: 'Job 5', category: jobCat._id, description: 'Desc 5', image: 'https://dummy.com/5.jpg', city: 'Bangalore', createdBy: adminId, companyName: 'Company 5', address: 'Address 5', pincode: '560001', salary: '90000', status: 'approved' },
            { id: 'job_c6', title: 'Job 6', category: jobCat._id, description: 'Desc 6', image: 'https://dummy.com/6.jpg', city: 'Chennai', createdBy: adminId, companyName: 'Company 6', address: 'Address 6', pincode: '600001', salary: '100000', status: 'approved' },
        ]);
        console.log('   ✓ 6 items');

        // CLASSIFIED CATEGORIES
        console.log('📝 Classified Categories...');
        await ClassifiedCategory.insertMany([
            { id: 'ccat_d1', name: 'Real Estate', image: 'https://dummy.com/1.jpg' },
            { id: 'ccat_d2', name: 'Vehicles', image: 'https://dummy.com/2.jpg' },
            { id: 'ccat_d3', name: 'Electronics', image: 'https://dummy.com/3.jpg' },
            { id: 'ccat_d4', name: 'Machinery', image: 'https://dummy.com/4.jpg' },
            { id: 'ccat_d5', name: 'Services', image: 'https://dummy.com/5.jpg' },
            { id: 'ccat_d6', name: 'Other', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 categories');

        // CLASSIFIEDS
        console.log('📝 Classifieds...');
        const classifCat = await ClassifiedCategory.findOne({ id: 'ccat_d1' });
        await Classified.insertMany([
            { id: 'clf_d1', title: 'Classified 1', category: classifCat._id, description: 'Desc 1', price: 100000, images: ['https://dummy.com/1.jpg'], address: 'Address 1', pincode: '110001', createdBy: adminId, status: 'approved' },
            { id: 'clf_d2', title: 'Classified 2', category: classifCat._id, description: 'Desc 2', price: 200000, images: ['https://dummy.com/2.jpg'], address: 'Address 2', pincode: '282001', createdBy: adminId, status: 'approved' },
            { id: 'clf_d3', title: 'Classified 3', category: classifCat._id, description: 'Desc 3', price: 300000, images: ['https://dummy.com/3.jpg'], address: 'Address 3', pincode: '208001', createdBy: adminId, status: 'approved' },
            { id: 'clf_d4', title: 'Classified 4', category: classifCat._id, description: 'Desc 4', price: 400000, images: ['https://dummy.com/4.jpg'], address: 'Address 4', pincode: '400001', createdBy: adminId, status: 'approved' },
            { id: 'clf_d5', title: 'Classified 5', category: classifCat._id, description: 'Desc 5', price: 500000, images: ['https://dummy.com/5.jpg'], address: 'Address 5', pincode: '560001', createdBy: adminId, status: 'approved' },
            { id: 'clf_d6', title: 'Classified 6', category: classifCat._id, description: 'Desc 6', price: 600000, images: ['https://dummy.com/6.jpg'], address: 'Address 6', pincode: '600001', createdBy: adminId, status: 'approved' },
        ]);
        console.log('   ✓ 6 items');

        // RASAM CATEGORIES
        console.log('📝 Rasam Categories...');
        const rasamCats = await RasamCategory.insertMany([
            { id: 'rcat_e1', name: 'Traditional', image: 'https://dummy.com/1.jpg' },
            { id: 'rcat_e2', name: 'Festival', image: 'https://dummy.com/2.jpg' },
            { id: 'rcat_e3', name: 'Health', image: 'https://dummy.com/3.jpg' },
        ]);
        console.log('   ✓ 3 categories');

        // RASAMS
        console.log('📝 Rasams...');
        await Rasam.insertMany([
            { id: 'rsm_e1', title: 'Rasam 1', description: 'Desc 1', image: 'https://dummy.com/1.jpg', city: 'Delhi', category: rasamCats[0]._id },
            { id: 'rsm_e2', title: 'Rasam 2', description: 'Desc 2', image: 'https://dummy.com/2.jpg', city: 'Agra', category: rasamCats[1]._id },
            { id: 'rsm_e3', title: 'Rasam 3', description: 'Desc 3', image: 'https://dummy.com/3.jpg', city: 'Kanpur', category: rasamCats[2]._id },
            { id: 'rsm_e4', title: 'Rasam 4', description: 'Desc 4', image: 'https://dummy.com/4.jpg', city: 'Mumbai', category: rasamCats[0]._id },
            { id: 'rsm_e5', title: 'Rasam 5', description: 'Desc 5', image: 'https://dummy.com/5.jpg', city: 'Bangalore', category: rasamCats[1]._id },
            { id: 'rsm_e6', title: 'Rasam 6', description: 'Desc 6', image: 'https://dummy.com/6.jpg', city: 'Chennai', category: rasamCats[2]._id },
        ]);
        console.log('   ✓ 6 items');

        // GALLERY CATEGORIES
        console.log('📝 Gallery Categories...');
        await GalleryCategory.insertMany([
            { id: 'gcat_f1', name: 'Events', image: 'https://dummy.com/1.jpg' },
            { id: 'gcat_f2', name: 'Cultural', image: 'https://dummy.com/2.jpg' },
            { id: 'gcat_f3', name: 'Festivals', image: 'https://dummy.com/3.jpg' },
            { id: 'gcat_f4', name: 'Business', image: 'https://dummy.com/4.jpg' },
            { id: 'gcat_f5', name: 'Education', image: 'https://dummy.com/5.jpg' },
            { id: 'gcat_f6', name: 'Welfare', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 categories');

        // GALLERIES
        console.log('📝 Galleries...');
        const galleryCats = await GalleryCategory.find({});
        await Gallery.insertMany([
            { id: 'gal_f1', name: 'Gallery 1', images: ['https://dummy.com/1.jpg'], category: galleryCats[0]._id },
            { id: 'gal_f2', name: 'Gallery 2', images: ['https://dummy.com/2.jpg'], category: galleryCats[1]._id },
            { id: 'gal_f3', name: 'Gallery 3', images: ['https://dummy.com/3.jpg'], category: galleryCats[2]._id },
            { id: 'gal_f4', name: 'Gallery 4', images: ['https://dummy.com/4.jpg'], category: galleryCats[3]._id },
            { id: 'gal_f5', name: 'Gallery 5', images: ['https://dummy.com/5.jpg'], category: galleryCats[4]._id },
            { id: 'gal_f6', name: 'Gallery 6', images: ['https://dummy.com/6.jpg'], category: galleryCats[5]._id },
        ]);
        console.log('   ✓ 6 items');

        // ACHIVERS CATEGORIES
        console.log('📝 Achivers Categories...');
        const achiversCats = await AchiversCategory.insertMany([
            { id: 'acat_g1', name: 'Business', image: 'https://dummy.com/1.jpg' },
            { id: 'acat_g2', name: 'Education', image: 'https://dummy.com/2.jpg' },
            { id: 'acat_g3', name: 'Social', image: 'https://dummy.com/3.jpg' },
            { id: 'acat_g4', name: 'Sports', image: 'https://dummy.com/4.jpg' },
            { id: 'acat_g5', name: 'Arts', image: 'https://dummy.com/5.jpg' },
            { id: 'acat_g6', name: 'Agriculture', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 categories');

        // ACHIVERS
        console.log('📝 Achivers...');
        await Achivers.insertMany([
            { id: 'ach_g1', title: 'Achiver 1', description: 'Desc 1', image: 'https://dummy.com/1.jpg', city: 'Delhi', date: new Date(), category: achiversCats[0]._id },
            { id: 'ach_g2', title: 'Achiver 2', description: 'Desc 2', image: 'https://dummy.com/2.jpg', city: 'Agra', date: new Date(), category: achiversCats[1]._id },
            { id: 'ach_g3', title: 'Achiver 3', description: 'Desc 3', image: 'https://dummy.com/3.jpg', city: 'Kanpur', date: new Date(), category: achiversCats[2]._id },
            { id: 'ach_g4', title: 'Achiver 4', description: 'Desc 4', image: 'https://dummy.com/4.jpg', city: 'Mumbai', date: new Date(), category: achiversCats[3]._id },
            { id: 'ach_g5', title: 'Achiver 5', description: 'Desc 5', image: 'https://dummy.com/5.jpg', city: 'Bangalore', date: new Date(), category: achiversCats[4]._id },
            { id: 'ach_g6', title: 'Achiver 6', description: 'Desc 6', image: 'https://dummy.com/6.jpg', city: 'Chennai', date: new Date(), category: achiversCats[5]._id },
        ]);
        console.log('   ✓ 6 items');

        // MAGAZINES
        console.log('📝 Magazines...');
        await Magazine.insertMany([
            { id: 'mag_h1', title: 'Magazine 1', description: 'Desc 1', pdf: 'https://dummy.com/1.pdf', image: 'https://dummy.com/1.jpg' },
            { id: 'mag_h2', title: 'Magazine 2', description: 'Desc 2', pdf: 'https://dummy.com/2.pdf', image: 'https://dummy.com/2.jpg' },
            { id: 'mag_h3', title: 'Magazine 3', description: 'Desc 3', pdf: 'https://dummy.com/3.pdf', image: 'https://dummy.com/3.jpg' },
            { id: 'mag_h4', title: 'Magazine 4', description: 'Desc 4', pdf: 'https://dummy.com/4.pdf', image: 'https://dummy.com/4.jpg' },
            { id: 'mag_h5', title: 'Magazine 5', description: 'Desc 5', pdf: 'https://dummy.com/5.pdf', image: 'https://dummy.com/5.jpg' },
            { id: 'mag_h6', title: 'Magazine 6', description: 'Desc 6', pdf: 'https://dummy.com/6.pdf', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 items');

        // DONATIONS
        console.log('📝 Donations...');
        await Donation.insertMany([
            { id: 'don_i1', title: 'Donation 1', description: 'Desc 1', image: 'https://dummy.com/1.jpg', url: 'https://donate.example.com/1' },
            { id: 'don_i2', title: 'Donation 2', description: 'Desc 2', image: 'https://dummy.com/2.jpg', url: 'https://donate.example.com/2' },
            { id: 'don_i3', title: 'Donation 3', description: 'Desc 3', image: 'https://dummy.com/3.jpg', url: 'https://donate.example.com/3' },
            { id: 'don_i4', title: 'Donation 4', description: 'Desc 4', image: 'https://dummy.com/4.jpg', url: 'https://donate.example.com/4' },
            { id: 'don_i5', title: 'Donation 5', description: 'Desc 5', image: 'https://dummy.com/5.jpg', url: 'https://donate.example.com/5' },
            { id: 'don_i6', title: 'Donation 6', description: 'Desc 6', image: 'https://dummy.com/6.jpg', url: 'https://donate.example.com/6' },
        ]);
        console.log('   ✓ 6 items');

        // VOLUNTEERS
        console.log('📝 Volunteers...');
        await Volunteer.insertMany([
            { id: 'vol_j1', name: 'Volunteer 1', city: 'Delhi', contactNo: '9876543210', designation: 'Chief', image: 'https://dummy.com/1.jpg' },
            { id: 'vol_j2', name: 'Volunteer 2', city: 'Agra', contactNo: '9876543211', designation: 'Manager', image: 'https://dummy.com/2.jpg' },
            { id: 'vol_j3', name: 'Volunteer 3', city: 'Kanpur', contactNo: '9876543212', designation: 'Coordinator', image: 'https://dummy.com/3.jpg' },
            { id: 'vol_j4', name: 'Volunteer 4', city: 'Mumbai', contactNo: '9876543213', designation: 'Lead', image: 'https://dummy.com/4.jpg' },
            { id: 'vol_j5', name: 'Volunteer 5', city: 'Bangalore', contactNo: '9876543214', designation: 'Officer', image: 'https://dummy.com/5.jpg' },
            { id: 'vol_j6', name: 'Volunteer 6', city: 'Chennai', contactNo: '9876543215', designation: 'Assistant', image: 'https://dummy.com/6.jpg' },
        ]);
        console.log('   ✓ 6 items');

        // SPONSORS
        console.log('📝 Sponsors...');
        const now = new Date();
        const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
        await Sponsor.insertMany([
            { id: 'spon_k1', title: 'Sponsor 1', image: 'https://dummy.com/1.jpg', city: 'Delhi', pincode: '110001', package: adminId, createdBy: adminId, startDate: now, expiryDate: futureDate, url: 'https://sponsor.com/1', status: 'approved' },
            { id: 'spon_k2', title: 'Sponsor 2', image: 'https://dummy.com/2.jpg', city: 'Agra', pincode: '282001', package: adminId, createdBy: adminId, startDate: now, expiryDate: futureDate, url: 'https://sponsor.com/2', status: 'approved' },
            { id: 'spon_k3', title: 'Sponsor 3', image: 'https://dummy.com/3.jpg', city: 'Kanpur', pincode: '208001', package: adminId, createdBy: adminId, startDate: now, expiryDate: futureDate, url: 'https://sponsor.com/3', status: 'approved' },
            { id: 'spon_k4', title: 'Sponsor 4', image: 'https://dummy.com/4.jpg', city: 'Mumbai', pincode: '400001', package: adminId, createdBy: adminId, startDate: now, expiryDate: futureDate, url: 'https://sponsor.com/4', status: 'approved' },
            { id: 'spon_k5', title: 'Sponsor 5', image: 'https://dummy.com/5.jpg', city: 'Bangalore', pincode: '560001', package: adminId, createdBy: adminId, startDate: now, expiryDate: futureDate, url: 'https://sponsor.com/5', status: 'approved' },
            { id: 'spon_k6', title: 'Sponsor 6', image: 'https://dummy.com/6.jpg', city: 'Chennai', pincode: '600001', package: adminId, createdBy: adminId, startDate: now, expiryDate: futureDate, url: 'https://sponsor.com/6', status: 'approved' },
        ]);
        console.log('   ✓ 6 items');

        // ORGANISATIONS
        console.log('📝 Organisations...');
        await Organisation.insertMany([
            { id: 'org_l1', title: 'Organisation 1', description: 'Desc 1', images: ['https://dummy.com/1.jpg'], city: 'Delhi' },
            { id: 'org_l2', title: 'Organisation 2', description: 'Desc 2', images: ['https://dummy.com/2.jpg'], city: 'Agra' },
            { id: 'org_l3', title: 'Organisation 3', description: 'Desc 3', images: ['https://dummy.com/3.jpg'], city: 'Kanpur' },
            { id: 'org_l4', title: 'Organisation 4', description: 'Desc 4', images: ['https://dummy.com/4.jpg'], city: 'Mumbai' },
            { id: 'org_l5', title: 'Organisation 5', description: 'Desc 5', images: ['https://dummy.com/5.jpg'], city: 'Bangalore' },
            { id: 'org_l6', title: 'Organisation 6', description: 'Desc 6', images: ['https://dummy.com/6.jpg'], city: 'Chennai' },
        ]);
        console.log('   ✓ 6 items');

        // SUGGESTIONS
        console.log('📝 Suggestions...');
        await Suggestion.insertMany([
            { id: 'sug_m1', text: 'Suggestion 1', image: 'https://dummy.com/1.jpg', createdBy: adminId },
            { id: 'sug_m2', text: 'Suggestion 2', image: 'https://dummy.com/2.jpg', createdBy: adminId },
            { id: 'sug_m3', text: 'Suggestion 3', image: 'https://dummy.com/3.jpg', createdBy: adminId },
            { id: 'sug_m4', text: 'Suggestion 4', image: 'https://dummy.com/4.jpg', createdBy: adminId },
            { id: 'sug_m5', text: 'Suggestion 5', image: 'https://dummy.com/5.jpg', createdBy: adminId },
            { id: 'sug_m6', text: 'Suggestion 6', image: 'https://dummy.com/6.jpg', createdBy: adminId },
        ]);
        console.log('   ✓ 6 items');

        // BLOOD BANKS
        console.log('📝 Blood Banks...');
        await BloodBank.insertMany([
            { id: 'bb_n1', name: 'Blood Bank 1', address: 'Address 1', city: 'Delhi', pincode: '110001', contactNo: '9876543210' },
            { id: 'bb_n2', name: 'Blood Bank 2', address: 'Address 2', city: 'Agra', pincode: '282001', contactNo: '9876543211' },
            { id: 'bb_n3', name: 'Blood Bank 3', address: 'Address 3', city: 'Kanpur', pincode: '208001', contactNo: '9876543212' },
            { id: 'bb_n4', name: 'Blood Bank 4', address: 'Address 4', city: 'Mumbai', pincode: '400001', contactNo: '9876543213' },
            { id: 'bb_n5', name: 'Blood Bank 5', address: 'Address 5', city: 'Bangalore', pincode: '560001', contactNo: '9876543214' },
            { id: 'bb_n6', name: 'Blood Bank 6', address: 'Address 6', city: 'Chennai', pincode: '600001', contactNo: '9876543215' },
        ]);
        console.log('   ✓ 6 items');

        // ABOUT
        console.log('📝 About...');
        await About.insertMany([
            { id: 'abt_o1', name: 'About 1', image: 'https://dummy.com/1.jpg', category: 'Business' },
            { id: 'abt_o2', name: 'About 2', image: 'https://dummy.com/2.jpg', category: 'Education' },
            { id: 'abt_o3', name: 'About 3', image: 'https://dummy.com/3.jpg', category: 'Social' },
            { id: 'abt_o4', name: 'About 4', image: 'https://dummy.com/4.jpg', category: 'Culture' },
            { id: 'abt_o5', name: 'About 5', image: 'https://dummy.com/5.jpg', category: 'Health' },
            { id: 'abt_o6', name: 'About 6', image: 'https://dummy.com/6.jpg', category: 'Welfare' },
        ]);
        console.log('   ✓ 6 items');

        console.log('\n✅ Population Complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

populateDatabase();
