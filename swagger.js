require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const port = process.env.PORT || 8080;

const doc = {
  info: {
    title: 'Videogames API',
    description: 'CRUD API for games and studios (Project 2, CSE341)',
  },
  host: process.env.SWAGGER_HOST || `localhost:${port}`,
  basePath: '/',
  // set SWAGGER_SCHEME=https for Render; default to http for local dev
  schemes: [process.env.SWAGGER_SCHEME || 'http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Format: Bearer {token}',
    },
  },
  definitions: {
    Studio: {
      _id: '65e0d3a0e4f9a24bc1e4d301',
      name: 'Retro Forge',
      location: 'Madrid, Spain',
      foundedYear: 2015,
      website: 'https://retroforge.dev',
      specialties: ['Metroidvania', 'Pixel Art'],
      size: 40,
      notes: 'Boutique team focused on hand-crafted metroidvanias.',
    },
    NewStudio: {
      name: 'Moonlight Works',
      location: 'Austin, TX',
      foundedYear: 2020,
      website: 'https://moonlight.gg',
      specialties: ['Indie', 'Strategy'],
      size: 28,
      notes: 'Remote-first studio shipping small-but-polished games.',
    },
    Game: {
      _id: '65e0d4cfe4f9a24bc1e4d305',
      title: 'Blade Runner Zero',
      genre: 'Action RPG',
      platform: 'PC',
      releaseYear: 2024,
      rating: 9,
      studio: {
        _id: '65e0d3a0e4f9a24bc1e4d301',
        name: 'Retro Forge',
      },
      summary: 'Neon-drenched action adventure set in a future mega city.',
    },
    NewGame: {
      title: 'Crystal Spire',
      genre: 'JRPG',
      platform: 'Switch',
      releaseYear: 2025,
      rating: 8,
      studio: '65e0d3a0e4f9a24bc1e4d301',
      summary: 'Classic turn-based epic with monster collecting.',
    },
    RegisterRequest: {
      username: 'player1',
      password: 'P@ssw0rd123',
    },
    LoginRequest: {
      username: 'admin',
      password: 'password123',
    },
    LoginResponse: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      tokenType: 'Bearer',
      expiresIn: 7200,
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
