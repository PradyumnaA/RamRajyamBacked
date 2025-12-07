const { io } = require('../index'); // Import io from server.js or from wherever it's exported

const { emitNotification } = require('../socket'); 
const Request = require('../models/userContactMatrimonyModel');
const Matrimony = require('../models/matrimonyModel');
const User = require('../models/userModels');

// Get All Requests
exports.getAllContactRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('matrimonyUser', 'fullName mobileNo') 
      .populate('requester', 'fullName mobileNo'); 

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.updateContactRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(id, { status }, { new: true })
      .populate('matrimonyUser', 'fullName mobileNo')
      .populate('requester', 'fullName mobileNo');

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    // Notify user based on status (approve/reject)
    const matrimony = await Matrimony.findById(request.matrimonyUser._id);
    const requester = await User.findById(request.requester._id);

    let notificationMessage = '';
    let eventName = 'statusUpdate'; // Event name for status updates

    if (status === 'approved') {
      notificationMessage = `Your request has been approved by the admin.`;
    } else if (status === 'rejected') {
      notificationMessage = `Your request has been rejected by the admin.`;
    }

    // Check if emitNotification function is defined
    if (typeof emitNotification === 'function') {
      // Emit a status update event with the notification message to the specific user
      emitNotification(requester._id, notificationMessage, eventName);
    } else {
      console.error('emitNotification function is not defined or is not a function');
    }

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    res.status(200).json({ success: true, message: "Deleted Request Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
module.exports = exports;
