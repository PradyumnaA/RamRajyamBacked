const Lead = require('../models/leadModel');
const JobCategory = require('../models/jobCategoryModels');
const User = require('../models/userModels');

// Add a new lead
exports.addLead = async (req, res) => {
  try {
    const { title, category, pincode, city, description } = req.body;
    const newLead = new Lead({
      title,
      category,
      pincode,
      city,
      description,
      createdBy: req.user._id
    });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leads created by the current user
exports.getOwnLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ createdBy: req.user._id })
      .populate('category')
      .populate('createdBy', 'fullName email'); // Populate createdBy with name and email
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('category')
      .populate('createdBy', 'fullName email'); // Populate createdBy with name and email
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a lead by ID
exports.updateLead = async (req, res) => {
    try {
      const { title, category, pincode, city, description } = req.body;
      const lead = await Lead.findById(req.params.id);
  
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      if (lead.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      lead.title = title || lead.title;
      lead.category = category || lead.category;
      lead.pincode = pincode || lead.pincode;
      lead.city = city || lead.city;
      lead.description = description || lead.description;
      lead.updatedAt = Date.now();
  
      await lead.save();
  
      // Populate category and createdBy fields
      const updatedLead = await Lead.findById(req.params.id)
        .populate('category')
        .populate('createdBy', 'fullName email');
  
      res.status(200).json(updatedLead);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);
      if (!lead) return res.status(404).json({ message: 'Lead not found' });
  
      if (lead.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await Lead.deleteOne({ _id: req.params.id }); // Corrected method
      res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get all leads of other users with optional pincode filter
exports.getAllOtherUserLeads = async (req, res) => {
    try {
      const { pincode } = req.query; // Get pincode filter from query params
      const filter = { createdBy: { $ne: req.user._id } };
  
      if (pincode) {
        filter.pincode = pincode; // Add pincode filter if provided
      }
  
      const leads = await Lead.find(filter)
        .populate('category')
        .populate('createdBy', 'fullName email'); // Populate createdBy with name and email
  
      res.status(200).json(leads);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Add interest to a lead
exports.showInterest = async (req, res) => {
    try {
      const leadId = req.params.id; // Lead ID from request params
      const userId = req.user._id; // User ID from the authenticated user
  
      // Find the lead and add the user's ID to the interestedUsers array
      const lead = await Lead.findByIdAndUpdate(
        leadId,
        { $addToSet: { interestedUsers: userId } },
        { new: true } // Return the updated lead
      ).populate('interestedUsers', 'fullName email'); // Populate interestedUsers with name and email
  
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      res.status(200).json(lead);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Get all leads with users who showed interest
// Get users who showed interest in the authenticated user's leads with lead details
exports.getUsersInterestedInMyLeads = async (req, res) => {
    try {
      // Find all leads created by the user
      const leads = await Lead.find({ createdBy: req.user._id })
        .populate({
          path: 'interestedUsers',
          select: 'fullName email contactNo' // Populate interested users with fullName, email, and contactNo
        })
        .populate('category'); // Populate lead category if needed
  
      // Extract interested users and their details
      const interestedUsers = [];
      leads.forEach(lead => {
        lead.interestedUsers.forEach(user => {
          // Include lead details with user
          const userDetails = {
            ...user._doc,
            leads: lead // Include lead details
          };
  
          // Add user to the list if not already present
          if (!interestedUsers.some(u => u._id.toString() === user._id.toString())) {
            interestedUsers.push(userDetails);
          }
        });
      });
  
      // If no interested users found
      if (interestedUsers.length === 0) {
        return res.status(404).json({ message: 'No users have shown interest in your leads' });
      }
  
      res.status(200).json(interestedUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
    