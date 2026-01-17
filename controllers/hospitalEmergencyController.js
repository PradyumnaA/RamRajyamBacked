const HospitalEmergency = require('../models/hospitalEmergencyModel');
const HospitalEmergencyCounter = require('../models/hospitalEmergencyCounter');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to get the next sequence value
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await HospitalEmergencyCounter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
};

// Get all doctors - filtered by city or nearby location
exports.getAllDoctors = async (req, res) => {
  try {
    const { city, specialty, latitude, longitude } = req.query;
    let filter = { verified: true, isKurmiSamajMember: true };

    if (city && city !== 'All') {
      filter.city = city;
    }

    if (specialty && specialty !== 'All') {
      filter.specialty = specialty;
    }

    const doctors = await HospitalEmergency.find(filter)
      .populate('userId', 'fullName email contactNo')
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: doctors,
      count: doctors.length,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message,
    });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await HospitalEmergency.findById(id)
      .populate('userId', 'fullName email contactNo')
      .populate('reviews.userId', 'fullName');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message,
    });
  }
};

// Register as doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, specialty, city, hospital, phone, email, qualifications, experience, description } = req.body;

    // Validate required fields
    if (!name || !specialty || !city || !hospital || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    let imageUrl = null;

    // Upload profile image if provided
    if (req.file) {
      const imageKey = `doctors/${uuidv4()}_${req.file.originalname}`;
      const params = {
        Bucket: process.env.UPLOADSIMAGEBUCKET,
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      imageUrl = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    }

    const id = await getNextSequenceValue('hospitalEmergencyId');

    const doctor = new HospitalEmergency({
      id,
      name,
      specialty,
      city,
      hospital,
      phone,
      email: email || req.user.email,
      qualifications: qualifications || [],
      experience: experience || 0,
      description,
      image: imageUrl,
      userId,
      isKurmiSamajMember: true,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted for verification',
      data: doctor,
    });
  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering doctor',
      error: error.message,
    });
  }
};

// Update doctor profile
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const updates = req.body;

    const doctor = await HospitalEmergency.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if user is owner
    if (doctor.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }

    // Handle image upload if provided
    if (req.file) {
      const imageKey = `doctors/${uuidv4()}_${req.file.originalname}`;
      const params = {
        Bucket: process.env.UPLOADSIMAGEBUCKET,
        Key: imageKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      updates.image = `https://${process.env.UPLOADSIMAGEBUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
    }

    Object.assign(doctor, updates);
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doctor profile',
      error: error.message,
    });
  }
};

// Delete doctor profile
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const doctor = await HospitalEmergency.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if user is owner
    if (doctor.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this profile',
      });
    }

    await HospitalEmergency.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Doctor profile deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor profile',
      error: error.message,
    });
  }
};

// Get doctors by city
exports.getDoctorsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const doctors = await HospitalEmergency.find({
      city,
      verified: true,
      isKurmiSamajMember: true,
    })
      .populate('userId', 'fullName email contactNo')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: doctors,
      count: doctors.length,
    });
  } catch (error) {
    console.error('Error fetching doctors by city:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors by city',
      error: error.message,
    });
  }
};

// Get doctors by specialty
exports.getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;

    const doctors = await HospitalEmergency.find({
      specialty,
      verified: true,
      isKurmiSamajMember: true,
    })
      .populate('userId', 'fullName email contactNo')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: doctors,
      count: doctors.length,
    });
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors by specialty',
      error: error.message,
    });
  }
};

// Add review to doctor
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const doctor = await HospitalEmergency.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const review = {
      userId,
      rating,
      comment,
    };

    doctor.reviews.push(review);

    // Calculate average rating
    const totalRating = doctor.reviews.reduce((sum, r) => sum + r.rating, 0);
    doctor.rating = totalRating / doctor.reviews.length;

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message,
    });
  }
};

// Get nearby doctors (within specified distance)
exports.getNearbyDoctors = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const doctors = await HospitalEmergency.find({
      verified: true,
      isKurmiSamajMember: true,
      latitude: { $exists: true },
      longitude: { $exists: true },
    }).populate('userId', 'fullName email contactNo');

    // Calculate distance for each doctor
    const doctorsWithDistance = doctors.map(doctor => {
      const distance = calculateDistance(
        latitude,
        longitude,
        doctor.latitude,
        doctor.longitude
      );
      return {
        ...doctor.toObject(),
        distance,
      };
    });

    // Filter by max distance
    const nearbyDoctors = doctorsWithDistance.filter(doc => doc.distance <= maxDistance);

    res.status(200).json({
      success: true,
      data: nearbyDoctors.sort((a, b) => a.distance - b.distance),
      count: nearbyDoctors.length,
    });
  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby doctors',
      error: error.message,
    });
  }
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
