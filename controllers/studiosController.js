const mongoose = require('mongoose');
const Studio = require('../models/studio');
const Game = require('../models/game');

const REQUIRED_FIELDS = ['name', 'location'];
const hasValue = (value) => value !== undefined && value !== null && value !== '';
const missingRequired = (payload = {}) => REQUIRED_FIELDS.filter((field) => !hasValue(payload[field]));

const getAll = async (req, res) => {
  // error handling with try/catch; unexpected issues -> 500
  try {
    const studios = await Studio.find().lean();
    res.status(200).json(studios);
  } catch (error) {
    console.error('Failed to retrieve studios', error);
    // 500 activated
    res.status(500).json({ message: 'Unable to fetch studios' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid studio id' });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const studio = await Studio.findById(id).lean();

    if (!studio) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    res.status(200).json(studio);
  } catch (error) {
    console.error(`Failed to retrieve studio with id ${id}`, error);
    // 500 activated
    res.status(500).json({ message: 'Unable to fetch studio' });
  }
};

const createStudio = async (req, res) => {
  const missing = missingRequired(req.body);

  if (missing.length) {
    // validation: required fields must be present -> 400
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const studio = await Studio.create(req.body);
    res.status(201).json(studio);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Failed to create studio', error);
    // 500 activated
    res.status(500).json({ message: 'Unable to create studio' });
  }
};

const updateStudio = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid studio id' });
  }

  const missing = missingRequired(req.body);

  if (missing.length) {
    // validation: required fields must be present -> 400
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const updated = await Studio.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Failed to update studio with id ${id}`, error);
    // 500 activated
    res.status(500).json({ message: 'Unable to update studio' });
  }
};

const deleteStudio = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid studio id' });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const hasGames = await Game.exists({ studio: id });

    if (hasGames) {
      return res.status(409).json({ message: 'Cannot delete studio while games reference it' });
    }

    const deleted = await Studio.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(`Failed to delete studio with id ${id}`, error);
    // 500 activated
    res.status(500).json({ message: 'Unable to delete studio' });
  }
};

module.exports = { getAll, getOne, createStudio, updateStudio, deleteStudio };
