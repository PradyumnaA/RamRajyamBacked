const mongoose = require('mongoose');
const JobCounter = require('./jobsCounter');

const jobSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, 
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'JobCategory', required: true },
  isApproved: { type: Boolean, default: false },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

jobSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await JobCounter.findByIdAndUpdate(
      { _id: 'jobId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.id = counter.seq;
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
