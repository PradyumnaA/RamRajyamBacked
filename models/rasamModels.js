const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const rasamSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'rasamCategory', required: true }, // Reference to Category
}, { timestamps: true });

// Apply the auto-increment plugin to the schema with a unique sequence identifier
rasamSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1, id: 'rasam_seq' });

const Rasam = mongoose.model('Rasam', rasamSchema);

module.exports = Rasam;
