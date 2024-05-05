const { errorResponder, errorTypes } = require('../../../core/errors');
const { InvestmentDeposit, User, Investment } = require('../../../models');

async function getInvestmentDeposits() {
  return await InvestmentDeposit.find().populate('email investment_code');
}

async function getInvestmentDeposit(id) {
  return await InvestmentDeposit.findById(id).populate('email investment_code');
}

async function createInvestmentDeposit(data) {
  const checkUser = await User.findOne({ email: data.email });
  if (!checkUser) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'User with this email does not exist'
    );
  }

  const checkInvestment = await Investment.findOne({
    code: data.investment_code,
  });
  if (!checkInvestment) {
    throw errorResponder(
      errorTypes.BAD_REQUEST,
      'Investment with this code does not exist'
    );
  }

  const investmentDeposit = new InvestmentDeposit(data);
  return await investmentDeposit.save();
}

async function updateInvestmentDeposit(id, data) {
  return await InvestmentDeposit.findByIdAndUpdate(id, data, { new: true });
}

async function deleteInvestmentDeposit(id) {
  return await InvestmentDeposit.findByIdAndRemove(id);
}

async function getInvestmentDepositByEmailAndCode(email, code) {
  return InvestmentDeposit.findOne({ email, investment_code: code });
}

module.exports = {
  getInvestmentDeposits,
  getInvestmentDeposit,
  createInvestmentDeposit,
  updateInvestmentDeposit,
  deleteInvestmentDeposit,
  getInvestmentDepositByEmailAndCode,
};
