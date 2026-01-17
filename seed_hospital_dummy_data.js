#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const HospitalEmergency = require('./models/hospitalEmergencyModel');
const HospitalEmergencyCounter = require('./models/hospitalEmergencyCounter');

const DUMMY_USER_ID = new mongoose.Types.ObjectId(); // Will be used as userId for all dummy hospitals

const DUMMY_HOSPITALS = [
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    city: 'Delhi',
    hospital: 'Apollo Hospital Delhi',
    phone: '9876543210',
    email: 'dr.rajesh@apollo.com',
    qualifications: ['MBBS', 'MD Cardiology', 'DM Interventional Cardiology'],
    experience: 15,
    rating: 4.8,
    availability: 'Available Now',
    description: 'Experienced cardiologist specializing in coronary angiography and interventional procedures.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 28.5355,
    longitude: 77.2107,
    distance: '2.5 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    city: 'Mumbai',
    hospital: 'Lilavati Hospital Mumbai',
    phone: '9123456789',
    email: 'dr.priya@lilavati.com',
    qualifications: ['MBBS', 'DCH', 'MD Pediatrics'],
    experience: 12,
    rating: 4.7,
    availability: 'Available Now',
    description: 'Child specialist with expertise in neonatal care and pediatric emergencies.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 19.0176,
    longitude: 72.8292,
    distance: '1.8 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Amit Patel',
    specialty: 'Orthopedics',
    city: 'Bangalore',
    hospital: 'Fortis Hospital Bangalore',
    phone: '8765432109',
    email: 'dr.amit@fortis.com',
    qualifications: ['MBBS', 'MS Orthopedics', 'FRCS'],
    experience: 18,
    rating: 4.9,
    availability: 'Available from 10 AM',
    description: 'Orthopedic surgeon specializing in joint replacement and arthroscopy.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 12.9352,
    longitude: 77.6245,
    distance: '3.2 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Neha Gupta',
    specialty: 'Gynecology',
    city: 'Chennai',
    hospital: 'Apollo Hospital Chennai',
    phone: '7654321098',
    email: 'dr.neha@apollo.com',
    qualifications: ['MBBS', 'DGO', 'MD OB/GYN'],
    experience: 14,
    rating: 4.6,
    availability: 'Available Now',
    description: 'Experienced gynecologist providing obstetric and gynecological care.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 13.0827,
    longitude: 80.2707,
    distance: '2.1 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'General Surgery',
    city: 'Pune',
    hospital: 'Ruby Hall Clinic Pune',
    phone: '9987654321',
    email: 'dr.vikram@rubyhall.com',
    qualifications: ['MBBS', 'MS General Surgery', 'FICS'],
    experience: 16,
    rating: 4.5,
    availability: 'Available Now',
    description: 'General surgeon with expertise in laparoscopic and open surgery procedures.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 18.5204,
    longitude: 73.8567,
    distance: '2.8 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Suresh Kumar',
    specialty: 'Neurology',
    city: 'Kolkata',
    hospital: 'AMRI Hospital Kolkata',
    phone: '8876543210',
    email: 'dr.suresh@amri.com',
    qualifications: ['MBBS', 'MD Neurology', 'DM Neurology'],
    experience: 17,
    rating: 4.7,
    availability: 'Available from 2 PM',
    description: 'Neurologist specializing in stroke management and epilepsy treatment.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 22.5726,
    longitude: 88.3639,
    distance: '1.9 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Anjali Sharma',
    specialty: 'Dermatology',
    city: 'Hyderabad',
    hospital: 'Continental Hospitals Hyderabad',
    phone: '9765432109',
    email: 'dr.anjali@continental.com',
    qualifications: ['MBBS', 'MD Dermatology', 'Fellowship in Cosmetic Dermatology'],
    experience: 13,
    rating: 4.6,
    availability: 'Available Now',
    description: 'Dermatologist offering treatment for skin diseases and cosmetic procedures.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 17.3850,
    longitude: 78.4867,
    distance: '2.4 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Rohan Das',
    specialty: 'Psychiatry',
    city: 'Ahmedabad',
    hospital: 'U.N. Mehta Institute of Cardiology',
    phone: '7765432109',
    email: 'dr.rohan@mehta.com',
    qualifications: ['MBBS', 'MD Psychiatry', 'Diploma in Psychotherapy'],
    experience: 11,
    rating: 4.4,
    availability: 'Available Now',
    description: 'Psychiatrist providing mental health care and psychological counseling.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 23.0225,
    longitude: 72.5714,
    distance: '3.1 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Divya Reddy',
    specialty: 'ENT',
    city: 'Jaipur',
    hospital: 'Fortis Jaipur Hospital',
    phone: '9654321098',
    email: 'dr.divya@fortis.com',
    qualifications: ['MBBS', 'MS ENT', 'Fellowship in Otology'],
    experience: 10,
    rating: 4.5,
    availability: 'Available Now',
    description: 'ENT specialist with expertise in hearing disorders and endoscopic surgery.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 26.8124,
    longitude: 75.7873,
    distance: '2.2 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Arun Kumar',
    specialty: 'Oncology',
    city: 'Lucknow',
    hospital: 'Medanta Hospital Lucknow',
    phone: '8654321098',
    email: 'dr.arun@medanta.com',
    qualifications: ['MBBS', 'MD Oncology', 'DM Medical Oncology'],
    experience: 19,
    rating: 4.8,
    availability: 'Available by appointment',
    description: 'Medical oncologist specializing in cancer treatment and chemotherapy.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 26.8467,
    longitude: 80.9462,
    distance: '2.7 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Meera Nair',
    specialty: 'Ophthalmology',
    city: 'Kochi',
    hospital: 'Aravind Eye Care System',
    phone: '9543210987',
    email: 'dr.meera@aravind.com',
    qualifications: ['MBBS', 'MS Ophthalmology', 'FRCS'],
    experience: 14,
    rating: 4.9,
    availability: 'Available Now',
    description: 'Ophthalmologist with expertise in cataract surgery and LASIK procedures.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 9.9312,
    longitude: 76.2673,
    distance: '1.5 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Karan Singh',
    specialty: 'Gastroenterology',
    city: 'Indore',
    hospital: 'Apollo Indore Hospital',
    phone: '8543210987',
    email: 'dr.karan@apollo.com',
    qualifications: ['MBBS', 'MD Gastroenterology', 'Fellowship in Endoscopy'],
    experience: 12,
    rating: 4.6,
    availability: 'Available Now',
    description: 'Gastroenterologist specializing in endoscopy and digestive disorders.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 22.7196,
    longitude: 75.8577,
    distance: '2.6 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Shreya Verma',
    specialty: 'Rheumatology',
    city: 'Bhopal',
    hospital: 'Bhopal Hospital',
    phone: '7543210987',
    email: 'dr.shreya@bhopal.com',
    qualifications: ['MBBS', 'MD Rheumatology', 'Fellowship in Rheumatology'],
    experience: 11,
    rating: 4.5,
    availability: 'Available from 11 AM',
    description: 'Rheumatologist treating arthritis and autoimmune disorders.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 23.1815,
    longitude: 79.9864,
    distance: '2.3 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Arjun Kapoor',
    specialty: 'Urology',
    city: 'Surat',
    hospital: 'Sudha Hospitals Surat',
    phone: '9432109876',
    email: 'dr.arjun@sudha.com',
    qualifications: ['MBBS', 'MS Urology', 'MCh Urology'],
    experience: 15,
    rating: 4.7,
    availability: 'Available Now',
    description: 'Urologist specializing in kidney stone treatment and prostate care.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 21.1458,
    longitude: 72.8326,
    distance: '2.9 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Bhavna Joshi',
    specialty: 'Nephrology',
    city: 'Nagpur',
    hospital: 'Care Hospital Nagpur',
    phone: '8432109876',
    email: 'dr.bhavna@care.com',
    qualifications: ['MBBS', 'MD Nephrology', 'DM Nephrology'],
    experience: 13,
    rating: 4.4,
    availability: 'Available Now',
    description: 'Nephrologist specializing in kidney diseases and dialysis management.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 21.1458,
    longitude: 79.0882,
    distance: '2.0 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Sanjana Roy',
    specialty: 'Pulmonology',
    city: 'Chandigarh',
    hospital: 'Max Hospital Chandigarh',
    phone: '7432109876',
    email: 'dr.sanjana@max.com',
    qualifications: ['MBBS', 'MD Pulmonology', 'Fellowship in Respiratory Medicine'],
    experience: 12,
    rating: 4.6,
    availability: 'Available Now',
    description: 'Pulmonologist offering respiratory disease management and critical care.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 30.7333,
    longitude: 76.7794,
    distance: '1.7 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Nikhil Mehra',
    specialty: 'Endocrinology',
    city: 'Ludhiana',
    hospital: 'Dayanand Medical College Hospital',
    phone: '9321098765',
    email: 'dr.nikhil@dmc.com',
    qualifications: ['MBBS', 'MD Endocrinology', 'DM Endocrinology'],
    experience: 14,
    rating: 4.7,
    availability: 'Available Now',
    description: 'Endocrinologist specializing in diabetes and hormonal disorders.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 30.9010,
    longitude: 75.8573,
    distance: '2.4 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Sakshi Bhat',
    specialty: 'Infectious Diseases',
    city: 'Pune',
    hospital: 'Jehangir Hospital Pune',
    phone: '8321098765',
    email: 'dr.sakshi@jehangir.com',
    qualifications: ['MBBS', 'MD Internal Medicine', 'Fellowship in Infectious Diseases'],
    experience: 11,
    rating: 4.5,
    availability: 'Available Now',
    description: 'Infectious disease specialist managing complex infections and immunology.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 18.5204,
    longitude: 73.8567,
    distance: '2.5 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Aman Singh',
    specialty: 'Dentistry',
    city: 'Gurgaon',
    hospital: 'Advanced Dental Care Center',
    phone: '7321098765',
    email: 'dr.aman@dentalcare.com',
    qualifications: ['BDS', 'MDS Prosthodontics', 'Fellowship in Dental Implants'],
    experience: 10,
    rating: 4.4,
    availability: 'Available Now',
    description: 'Dental specialist offering implants, crowns, and cosmetic dentistry.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 28.4595,
    longitude: 77.0266,
    distance: '3.0 km',
    isKurmiSamajMember: true
  },
  {
    name: 'Dr. Pooja Desai',
    specialty: 'Anesthesiology',
    city: 'Vadodara',
    hospital: 'SSG Hospital Vadodara',
    phone: '9210987654',
    email: 'dr.pooja@ssg.com',
    qualifications: ['MBBS', 'MD Anesthesiology', 'Fellowship in Regional Anesthesia'],
    experience: 13,
    rating: 4.6,
    availability: 'Available Now',
    description: 'Anesthesiologist with expertise in pain management and critical care anesthesia.',
    verified: true,
    verifiedByAdmin: true,
    latitude: 22.3072,
    longitude: 73.1812,
    distance: '2.2 km',
    isKurmiSamajMember: true
  }
];

async function seedHospitals() {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    console.error('❌ Please set MONGODB_URL in your .env file');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing hospitals
    console.log('🗑️  Clearing existing hospitals...');
    await HospitalEmergency.deleteMany({});
    await HospitalEmergencyCounter.deleteMany({});

    // Reset counter
    console.log('🔄 Resetting hospital counter...');
    await HospitalEmergencyCounter.create({ _id: 'hospitalEmergencyId', seq: 0 });

    // Seed hospitals
    console.log(`🏥 Seeding ${DUMMY_HOSPITALS.length} dummy hospitals/doctors...`);
    const hospitalsToInsert = DUMMY_HOSPITALS.map((hospital, index) => ({
      id: index + 1,
      ...hospital,
      userId: DUMMY_USER_ID,
      image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(hospital.name)}`,
      reviews: [
        {
          userId: DUMMY_USER_ID,
          rating: hospital.rating,
          comment: 'Excellent service and professional treatment.',
          createdAt: new Date()
        }
      ]
    }));

    const result = await HospitalEmergency.insertMany(hospitalsToInsert);
    console.log(`✅ Successfully inserted ${result.length} hospitals/doctors`);

    // Get statistics
    const specialties = [...new Set(DUMMY_HOSPITALS.map(h => h.specialty))];
    const cities = [...new Set(DUMMY_HOSPITALS.map(h => h.city))];
    const avgRating = (DUMMY_HOSPITALS.reduce((sum, h) => sum + h.rating, 0) / DUMMY_HOSPITALS.length).toFixed(2);
    const avgExperience = Math.round(DUMMY_HOSPITALS.reduce((sum, h) => sum + h.experience, 0) / DUMMY_HOSPITALS.length);

    console.log('\n📊 Seeded Hospitals/Doctors Summary:');
    console.log(`   Total Doctors: ${result.length}`);
    console.log(`   Specialties: ${specialties.length}`);
    console.log(`   Cities Covered: ${cities.length}`);
    console.log(`   Average Rating: ${avgRating}/5`);
    console.log(`   Average Experience: ${avgExperience} years`);
    console.log(`   All Verified: ✓`);
    console.log(`   Kurmi Samaj Members: ✓ All`);
    
    console.log('\n   Specialties:', specialties.join(', '));
    console.log('\n   Cities:', cities.join(', '));

  } catch (err) {
    console.error('❌ Error seeding hospitals:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✨ Seeding completed. Disconnected from MongoDB.');
  }
}

seedHospitals();
