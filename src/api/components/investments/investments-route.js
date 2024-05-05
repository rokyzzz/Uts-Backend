const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const investmentsControllers = require('./investments-controller');
const investmentsValidator = require('./investments-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/investments', route);

  // Get list of investments
  route.get(
    '/',
    authenticationMiddleware,
    investmentsControllers.getInvestments
  );

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(investmentsValidator.createInvestment),
    investmentsControllers.createInvestment
  );

  // Get user detail
  route.get(
    '/:id',
    authenticationMiddleware,
    investmentsControllers.getInvestment
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(investmentsValidator.updateInvestment),
    investmentsControllers.updateInvestment
  );

  // Delete user
  route.delete(
    '/:id',
    authenticationMiddleware,
    investmentsControllers.deleteInvestment
  );
};
