// controllers/businessNetworkController.js

const BusinessNetwork = require('../models/businessNetworkModels');
const businessNetworkCounter = require('../models/businessNetworkCounter');
const Category = require('../models/jobCategoryModels');
const User = require('../models/userModels');

// Helper function to get the next sequence value
const getNextbusinessNetworkSequenceValue = async (sequenceName) => {
  const counter = await businessNetworkCounter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

exports.createbusinessNetwork = async (req, res) => {
    const { title, category, description, pincode, city } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
  
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }
  
    if (!pincode || !city) {
      return res.status(400).json({ error: 'Pincode and city are required' });
    }
  
    try {
      const id = await getNextbusinessNetworkSequenceValue('businessNetworkId');
      let newbusinessNetwork = new BusinessNetwork({
        id,
        title,
        image,
        category,
        description,
        city,
        pincode
      });
      newbusinessNetwork = await newbusinessNetwork.save();
  
      // Manually lookup category details
      const categoryDetails = await Category.findOne({ id: newbusinessNetwork.category });
      const response = {
        ...newbusinessNetwork.toObject(),
        category: {
          id: categoryDetails.id,
          name: categoryDetails.name,
          image: categoryDetails.image,
        },
      };
  
      res.status(201).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  



  exports.getbusinessNetwork = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', pincode = '' } = req.query;
        
        // Building the filter
        const filter = {};
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (pincode) {
            filter.pincode = pincode;
        }

        const skip = (page - 1) * limit;

        const businessNetworkList = await BusinessNetwork.find(filter).skip(skip).limit(Number(limit));
        const totalbusinessNetwork = await BusinessNetwork.countDocuments(filter);

        // Manually lookup category details for each event item
        const populatedbusinessNetworkList = await Promise.all(businessNetworkList.map(async (businessNetworkItem) => {
            const categoryDetails = await Category.findOne({ id: businessNetworkItem.category });

            // Fetch registered user details
            const registeredUser = await User.findOne({ id: businessNetworkItem.registeredUserId });

            return {
                ...businessNetworkItem.toObject(),
                category: categoryDetails ? {
                    id: categoryDetails.id,
                    name: categoryDetails.name,
                    image: categoryDetails.image,
                } : null,
                registeredUser: registeredUser ? registeredUser.toObject() : null,
            };
        }));

        res.status(200).json({
            businessNetwork: populatedbusinessNetworkList,
            currentPage: Number(page),
            totalPages: Math.ceil(totalbusinessNetwork / limit),
            totalbusinessNetwork,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




  exports.getbusinessNetworkById = async (req, res) => {
    try {
      const businessNetwork = await BusinessNetwork.findOne({ id: req.params.id });
  
      if (!businessNetwork) {
        return res.status(404).json({ error: 'businessNetwork not found' });
      }
  
      // Manually lookup category details
      const categoryDetails = await Category.findOne({ id: businessNetwork.category });
      const response = {
        ...businessNetwork.toObject(),
        category: {
          id: categoryDetails.id,
          name: categoryDetails.name,
          image: categoryDetails.image,
        },
      };
  
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
exports.updatebusinessNetworkById = async (req, res) => {
    const { title, category, description, city,  pincode} = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
  
    try {
      const businessNetwork = await BusinessNetwork.findOne({ id: req.params.id });
  
      if (!businessNetwork) {
        return res.status(404).json({ error: 'businessNetwork not found' });
      }
  
      // If category is not provided in the request body, use the existing category
      const categoryId = category ? Number(category) : businessNetwork.category;
  
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
  
      const updatedFields = {};
      if (title) updatedFields.title = title;
      if (image) updatedFields.image = image;
      if (description) updatedFields.description = description;
      if (city) updatedFields.city = city;
      if (pincode) updatedFields.pincode = pincode; // Allow pincode to be updated
      updatedFields.category = categoryId;
  
      const updatedbusinessNetwork = await BusinessNetwork.findOneAndUpdate(
        { id: req.params.id },
        updatedFields,
        { new: true }
      );
  
      // Manually lookup category details
      const categoryDetails = await Category.findOne({ id: updatedbusinessNetwork.category });
      if (!categoryDetails) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
  
      const response = {
        ...updatedbusinessNetwork.toObject(),
        category: {
          id: categoryDetails.id,
          name: categoryDetails.name,
          image: categoryDetails.image,
        },
      };
  
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.deletebusinessNetworkById = async (req, res) => {
  try {
    const businessNetwork = await BusinessNetwork.findOneAndDelete({ id: req.params.id });

    if (!businessNetwork) {
      return res.status(404).json({ error: 'businessNetwork not found' });
    }

    res.status(200).json({ message: 'businessNetwork deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
