const investmentDepositRepository = require('./investment-deposit-repository');

async function getInvestmentDeposits(
  pageNumber = 1,
  pageSize = 10,
  search = '',
  sort = ''
) {
  // return await investmentDepositRepository.getInvestmentDeposits();
  let investmentDeposit =
    await investmentDepositRepository.getInvestmentDeposits();

  // Apply search filter
  if (search) {
    const [searchField, searchValue] = search.split(':');
    investmentDeposit = investmentDeposit.filter((user) =>
      user[searchField].includes(searchValue)
    );
  }

  // Apply sorting
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    investmentDeposit.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField].localeCompare(b[sortField]);
      } else if (sortOrder === 'desc') {
        return b[sortField].localeCompare(a[sortField]);
      }
      return 0;
    });
  }

  const totalCount = investmentDeposit.length;
  const totalPages = Math.ceil(totalCount / parseFloat(pageSize));
  const startIndex = (parseFloat(pageNumber) - 1) * parseFloat(pageSize);
  const endIndex = parseFloat(startIndex) + parseFloat(pageSize);
  const data = investmentDeposit.slice(startIndex, endIndex);

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: data.length,
    total_pages: totalPages,
    has_previous_page: pageNumber > 1,
    has_next_page: pageNumber < totalPages,
    data: data,
  };
}

async function getInvestmentDeposit(id) {
  return await investmentDepositRepository.getInvestmentDeposit(id);
}

async function createInvestmentDeposit(data) {
  return await investmentDepositRepository.createInvestmentDeposit(data);
}

async function updateInvestmentDeposit(id, data) {
  return await investmentDepositRepository.updateInvestmentDeposit(id, data);
}

async function deleteInvestmentDeposit(id) {
  return await investmentDepositRepository.deleteInvestmentDeposit(id);
}

module.exports = {
  getInvestmentDeposits,
  getInvestmentDeposit,
  createInvestmentDeposit,
  updateInvestmentDeposit,
  deleteInvestmentDeposit,
};
