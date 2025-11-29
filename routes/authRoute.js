const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Create a new account'
    #swagger.description = 'Register with a username and password to receive a Bearer token.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/RegisterRequest' }
    }
    #swagger.responses[201] = {
      description: 'Account created and token issued',
      schema: { $ref: '#/definitions/LoginResponse' }
    }
  */
  authController.register
);

router.post(
  '/login',
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Obtain a JWT token'
    #swagger.description = 'Provide the configured username and password to receive a Bearer token.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/LoginRequest' }
    }
    #swagger.responses[200] = {
      description: 'JWT token',
      schema: { $ref: '#/definitions/LoginResponse' }
    }
  */
  authController.login
);

router.post(
  '/logout',
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Logout (client discards token)'
    #swagger.description = 'Requires a valid token; response indicates the token can be discarded client-side.'
    #swagger.security = [{ BearerAuth: [] }]
  */
  requireAuth,
  authController.logout
);

module.exports = router;
