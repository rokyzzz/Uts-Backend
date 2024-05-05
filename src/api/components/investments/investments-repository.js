// const Investment = require('../../../models/investments-schema');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { Investment } = require('../../../models');

async function getInvestments() {
  return await Investment.find();
}

async function getInvestment(id) {
  return await Investment.findById(id);
}

async function createInvestment(data) {
  const checkCode = await Investment.findOne({ code: data.code });
  if (checkCode) {
    // throw new Error('Code already exists');
    throw errorResponder(errorTypes.BAD_REQUEST, 'Code already exists');
  }
  const investment = new Investment(data);
  return await investment.save();
}

async function updateInvestment(id, data) {
  return await Investment.findByIdAndUpdate(id, data, { new: true });
}

async function deleteInvestment(id) {
  return await Investment.findByIdAndRemove(id);
}

async function getInvestmentByCode(code) {
  return Investment.findOne({ code });
}

module.exports = {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentByCode,
};
