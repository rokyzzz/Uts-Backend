const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const investmentDepositControllers = require('./investment-deposit-controller');
const investmentDepositValidator = require('./investment-deposit-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/investment-deposit', route);

  // Get list of investmentDeposit
  route.get(
    '/',
    authenticationMiddleware,
    investmentDepositControllers.getInvestmentDeposits
  );

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(investmentDepositValidator.createInvestmentDeposit),
    investmentDepositControllers.createInvestmentDeposit
  );

  // Get user detail
  route.get(
    '/:id',
    authenticationMiddleware,
    investmentDepositControllers.getInvestmentDeposit
  );

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(investmentDepositValidator.updateInvestmentDeposit),
    investmentDepositControllers.updateInvestmentDeposit
  );

  // Delete user
  route.delete(
    '/:id',
    authenticationMiddleware,
    investmentDepositControllers.deleteInvestmentDeposit
  );
};
