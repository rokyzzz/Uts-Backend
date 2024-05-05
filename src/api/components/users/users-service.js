const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { default: pino } = require('pino');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(pageNumber = 1, pageSize = 10, search = '', sort = '') {
  let users = await usersRepository.getUsers();

  // Apply search filter
  if (search) {
    const [searchField, searchValue] = search.split(':');
    users = users.filter((user) => user[searchField].includes(searchValue));
  }

  // Apply sorting
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    users.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField].localeCompare(b[sortField]);
      } else if (sortOrder === 'desc') {
        return b[sortField].localeCompare(a[sortField]);
      }
      return 0;
    });
  }

  const totalCount = users.length;
  const totalPages = Math.ceil(totalCount / parseFloat(pageSize));
  const startIndex = (parseFloat(pageNumber) - 1) * parseFloat(pageSize);
  const endIndex = parseFloat(startIndex) + parseFloat(pageSize);
  const data = users.slice(startIndex, endIndex);
  console.log(data);
  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: data.length,
    total_pages: totalPages,
    has_previous_page: pageNumber > 1,
    has_next_page: pageNumber < totalPages,

    data: data.map((user) => {
      let data = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      if (user.role === 'bank-customers') {
        data.total_investment = user.investment_deposits.reduce(
          (sum, deposit) => sum + deposit.amount,
          0
        );
        data.investment_deposits = user.investment_deposits;
      }

      return data;
    }),
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password, role = 'admin') {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword, role);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
