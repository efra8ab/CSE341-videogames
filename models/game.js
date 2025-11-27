const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    releaseYear: { type: Number, required: true, min: 1950, max: 2100 },
    rating: { type: Number, min: 0, max: 10 },
    studio: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', required: true },
    summary: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: 'videogames', 
  }
);

module.exports = mongoose.model('Game', gameSchema);
