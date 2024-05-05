const joi = require('joi');

module.exports = {
  createInvestment: {
    body: {
      code: joi.string().min(1).max(100).required().label('Code'),
      type: joi.string().min(1).max(100).required().label('Type'),
      name: joi.string().min(1).max(100).required().label('Name'),
      description: joi.string().min(1).max(500).required().label('Description'),
    },
  },

  updateInvestment: {
    body: {
      code: joi.string().min(1).max(100).label('Code'),
      type: joi.string().min(1).max(100).label('Type'),
      name: joi.string().min(1).max(100).label('Name'),
      description: joi.string().min(1).max(500).label('Description'),
    },
  },
};
