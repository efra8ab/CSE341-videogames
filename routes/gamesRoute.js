const express = require('express');
const gamesController = require('../controllers/gamesController');

const router = express.Router();

router.get(
  '/',
  /* 
    #swagger.tags = ['Games']
    #swagger.summary = 'Retrieve all games'
    #swagger.responses[200] = {
      description: 'A list of games',
      schema: [{ $ref: '#/definitions/Game' }]
    }
  */
  gamesController.getAll
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Games']
    #swagger.summary = 'Retrieve a single game'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the game'
    }
    #swagger.responses[200] = {
      description: 'Game that matches the provided id',
      schema: { $ref: '#/definitions/Game' }
    }
  */
  gamesController.getOne
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Games']
    #swagger.summary = 'Create a new game'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewGame' }
    }
    #swagger.responses[201] = {
      description: 'The created game',
      schema: { $ref: '#/definitions/Game' }
    }
  */
  gamesController.createGame
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Games']
    #swagger.summary = 'Update a game'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the game'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewGame' }
    }
    #swagger.responses[200] = {
      description: 'Updated game',
      schema: { $ref: '#/definitions/Game' }
    }
  */
  gamesController.updateGame
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Games']
    #swagger.summary = 'Delete a game'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the game'
    }
    #swagger.responses[204] = {
      description: 'Game removed successfully'
    }
  */
  gamesController.deleteGame
);

module.exports = router;
