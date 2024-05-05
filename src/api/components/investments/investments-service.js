const investmentsRepository = require('./investments-repository');

async function getInvestments(
  pageNumber = 1,
  pageSize = 10,
  search = '',
  sort = ''
) {
  // return await investmentsRepository.getInvestments();
  let investment = await investmentsRepository.getInvestments();

  // Apply search filter
  if (search) {
    const [searchField, searchValue] = search.split(':');
    investment = investment.filter((user) =>
      user[searchField].includes(searchValue)
    );
  }

  // Apply sorting
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    investment.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField].localeCompare(b[sortField]);
      } else if (sortOrder === 'desc') {
        return b[sortField].localeCompare(a[sortField]);
      }
      return 0;
    });
  }

  const totalCount = investment.length;
  const totalPages = Math.ceil(totalCount / parseFloat(pageSize));
  const startIndex = (parseFloat(pageNumber) - 1) * parseFloat(pageSize);
  const endIndex = parseFloat(startIndex) + parseFloat(pageSize);
  const data = investment.slice(startIndex, endIndex);

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

async function getInvestment(id) {
  return await investmentsRepository.getInvestment(id);
}

async function createInvestment(data) {
  return await investmentsRepository.createInvestment(data);
}

async function updateInvestment(id, data) {
  return await investmentsRepository.updateInvestment(id, data);
}

async function deleteInvestment(id) {
  return await investmentsRepository.deleteInvestment(id);
}

module.exports = {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};
