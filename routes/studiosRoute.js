const express = require('express');
const studiosController = require('../controllers/studiosController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  /* 
    #swagger.tags = ['Studios']
    #swagger.summary = 'Retrieve all studios'
    #swagger.responses[200] = {
      description: 'A list of studios',
      schema: [{ $ref: '#/definitions/Studio' }]
    }
  */
  studiosController.getAll
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Studios']
    #swagger.summary = 'Retrieve a single studio'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the studio'
    }
    #swagger.responses[200] = {
      description: 'Studio that matches the provided id',
      schema: { $ref: '#/definitions/Studio' }
    }
  */
  studiosController.getOne
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Studios']
    #swagger.summary = 'Create a new studio'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewStudio' }
    }
    #swagger.responses[201] = {
      description: 'The created studio',
      schema: { $ref: '#/definitions/Studio' }
    }
    #swagger.security = [{ BearerAuth: [] }]
  */
  requireAuth,
  studiosController.createStudio
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Studios']
    #swagger.summary = 'Update a studio'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the studio'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewStudio' }
    }
    #swagger.responses[200] = {
      description: 'Updated studio',
      schema: { $ref: '#/definitions/Studio' }
    }
    #swagger.security = [{ BearerAuth: [] }]
  */
  requireAuth,
  studiosController.updateStudio
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Studios']
    #swagger.summary = 'Delete a studio'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the studio'
    }
    #swagger.responses[204] = {
      description: 'Studio removed successfully'
    }
    #swagger.security = [{ BearerAuth: [] }]
  */
  requireAuth,
  studiosController.deleteStudio
);

module.exports = router;
