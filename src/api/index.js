const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const investments = require('./components/investments/investments-route');
const investmentDeposit = require('./components/investment-deposit/investment-deposit-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  investments(app);
  investmentDeposit(app);

  return app;
};
