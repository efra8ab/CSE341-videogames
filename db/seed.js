require('dotenv').config();
const { connectDb, disconnectDb } = require('./connect');
const Studio = require('../models/studio');
const Game = require('../models/game');

const studios = [
  {
    name: 'Neon Forge',
    location: 'Seattle, WA',
    foundedYear: 2012,
    website: 'https://neonforge.gg',
    specialties: ['Action', 'Immersive Sim'],
    size: 180,
    notes: 'Focuses on neon-soaked cityscapes and dense worldbuilding.',
  },
  {
    name: 'Snowpeak Labs',
    location: 'Reykjavik, Iceland',
    foundedYear: 2018,
    website: 'https://snowpeak.is',
    specialties: ['Survival', 'Co-op'],
    size: 75,
    notes: 'Co-op survival specialists with strong environmental storytelling.',
  },
];

const seed = async () => {
  await connectDb();
  console.log('Seeding database...');

  await Game.deleteMany({});
  await Studio.deleteMany({});

  const createdStudios = await Studio.insertMany(studios);
  const studioByName = createdStudios.reduce((map, studio) => {
    map[studio.name] = studio._id;
    return map;
  }, {});

  const games = [
    {
      title: 'Circuit Breaker',
      genre: 'Action RPG',
      platform: 'PC',
      releaseYear: 2023,
      rating: 8.7,
      studio: studioByName['Neon Forge'],
      summary: 'Neon-drenched open world with hacking and parkour.',
    },
    {
      title: 'Glacier Run',
      genre: 'Survival',
      platform: 'PC',
      releaseYear: 2024,
      rating: 8.3,
      studio: studioByName['Snowpeak Labs'],
      summary: 'Four-player co-op trek across a dynamic frozen frontier.',
    },
    {
      title: 'Echoes of Steel',
      genre: 'Immersive Sim',
      platform: 'PS5',
      releaseYear: 2025,
      rating: 9.1,
      studio: studioByName['Neon Forge'],
      summary: 'Stealth-forward story with player-shaped factions.',
    },
  ];

  await Game.insertMany(games);

  console.log('✅ Seed complete');
  await disconnectDb();
  process.exit(0);
};

seed().catch((error) => {
  console.error('❌ Seed failed', error);
  process.exit(1);
});
