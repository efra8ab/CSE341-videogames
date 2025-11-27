const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    foundedYear: { type: Number, min: 1950, max: 2100 },
    website: { type: String, trim: true },
    specialties: { type: [String], default: [] },
    size: { type: Number, min: 1, max: 10000 }, // team size
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Studio', studioSchema);
