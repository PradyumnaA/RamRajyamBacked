const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const organisationsSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    city: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Organisations || mongoose.model('Organisations', organisationsSchema);
