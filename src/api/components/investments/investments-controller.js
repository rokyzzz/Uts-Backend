const investmentsService = require('./investments-service');

async function getInvestments(request, response, next) {
  try {
    const investments = await investmentsService.getInvestments();
    response.json(investments);
  } catch (error) {
    next(error);
  }
}

async function getInvestment(request, response, next) {
  try {
    const investment = await investmentsService.getInvestment(
      request.params.id
    );
    response.json(investment);
  } catch (error) {
    next(error);
  }
}

async function createInvestment(request, response, next) {
  try {
    const investment = await investmentsService.createInvestment(request.body);
    response.status(201).json(investment);
  } catch (error) {
    next(error);
  }
}

async function updateInvestment(request, response, next) {
  try {
    const investment = await investmentsService.updateInvestment(
      request.params.id,
      request.body
    );
    response.json(investment);
  } catch (error) {
    next(error);
  }
}

async function deleteInvestment(request, response, next) {
  try {
    await investmentsService.deleteInvestment(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};
