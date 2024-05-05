const joi = require('joi');

module.exports = {
  createInvestmentDeposit: {
    body: {
      email: joi.string().email().required().label('Email'),
      investment_code: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Investment Code'),
      amount: joi.number().positive().required().label('Amount'),
    },
  },

  updateInvestmentDeposit: {
    body: {
      email: joi.string().email().label('Email'),
      investment_code: joi.string().min(1).max(100).label('Investment Code'),
      amount: joi.number().positive().label('Amount'),
    },
  },
};
