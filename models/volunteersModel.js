const mongoose = require('mongoose');
const Counter = require('./volunteersCounter');

const volunteerSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  city: { type: String, required: true },
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  designation: { type: String, required: true } ,
  image: { type: String ,required: true }
 
}, { timestamps: true });

volunteerSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'volunteerId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
