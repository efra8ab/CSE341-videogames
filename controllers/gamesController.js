const mongoose = require('mongoose');
const Game = require('../models/game');
const Studio = require('../models/studio');

const REQUIRED_FIELDS = ['title', 'genre', 'platform', 'releaseYear', 'studio'];
const hasValue = (value) => value !== undefined && value !== null && value !== '';
const missingRequired = (payload = {}) => REQUIRED_FIELDS.filter((field) => !hasValue(payload[field]));

const ensureStudioExists = async (studioId) => {
  if (!mongoose.isValidObjectId(studioId)) {
    return { ok: false, status: 400, message: 'Invalid studio id' };
  }

  const studioExists = await Studio.exists({ _id: studioId });

  if (!studioExists) {
    return { ok: false, status: 404, message: 'Studio not found for provided studio id' };
  }

  return { ok: true };
};

const getAll = async (req, res) => {
  // error handling with try/catch; unexpected issues -> 500
  try {
    const games = await Game.find().populate('studio', 'name location').lean();
    res.status(200).json(games);
  } catch (error) {
    console.error('Failed to retrieve games', error);
    // 500 activated
    res.status(500).json({ message: 'Unable to fetch games' });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid game id' });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const game = await Game.findById(id).populate('studio', 'name location').lean();

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error(`Failed to retrieve game with id ${id}`, error);
    // 500 activated
    res.status(500).json({ message: 'Unable to fetch game' });
  }
};

const createGame = async (req, res) => {
  const missing = missingRequired(req.body);

  if (missing.length) {
    // validation: required fields must be present -> 400
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  const studioCheck = await ensureStudioExists(req.body.studio);
  if (!studioCheck.ok) {
    return res.status(studioCheck.status).json({ message: studioCheck.message });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Failed to create game', error);
    // 500 activated
    res.status(500).json({ message: 'Unable to create game' });
  }
};

const updateGame = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid game id' });
  }

  const missing = missingRequired(req.body);
  if (missing.length) {
    // validation: required fields must be present -> 400
    return res.status(400).json({ message: 'Missing required fields', missingFields: missing });
  }

  const studioCheck = await ensureStudioExists(req.body.studio);
  if (!studioCheck.ok) {
    return res.status(studioCheck.status).json({ message: studioCheck.message });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const updated = await Game.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('studio', 'name location')
      .lean();

    if (!updated) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Failed to update game with id ${id}`, error);
    // 500 activated
    res.status(500).json({ message: 'Unable to update game' });
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid game id' });
  }

  // error handling with try/catch; unexpected issues -> 500
  try {
    const deleted = await Game.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(`Failed to delete game with id ${id}`, error);
    // 500 activated
    res.status(500).json({ message: 'Unable to delete game' });
  }
};

module.exports = { getAll, getOne, createGame, updateGame, deleteGame };
