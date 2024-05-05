const investmentDepositService = require('./investment-deposit-service');

async function getInvestmentDeposits(request, response, next) {
  try {
    const investmentDeposit =
      await investmentDepositService.getInvestmentDeposits();
    response.json(investmentDeposit);
  } catch (error) {
    next(error);
  }
}

async function getInvestmentDeposit(request, response, next) {
  try {
    const investment = await investmentDepositService.getInvestmentDeposit(
      request.params.id
    );
    response.json(investment);
  } catch (error) {
    next(error);
  }
}

async function createInvestmentDeposit(request, response, next) {
  try {
    const investment = await investmentDepositService.createInvestmentDeposit(
      request.body
    );
    response.status(201).json(investment);
  } catch (error) {
    next(error);
  }
}

async function updateInvestmentDeposit(request, response, next) {
  try {
    const investment = await investmentDepositService.updateInvestmentDeposit(
      request.params.id,
      request.body
    );
    response.json(investment);
  } catch (error) {
    next(error);
  }
}

async function deleteInvestmentDeposit(request, response, next) {
  try {
    await investmentDepositService.deleteInvestmentDeposit(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInvestmentDeposits,
  getInvestmentDeposit,
  createInvestmentDeposit,
  updateInvestmentDeposit,
  deleteInvestmentDeposit,
};
