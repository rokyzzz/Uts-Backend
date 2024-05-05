const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const usersService = require('../users/users-service');

const { LoginAttemp, UserLog } = require('../../../models/');
const MAX_LOGIN_ATTEMPTS = 5;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if user has reached max login attempts
    const lastAttempt = await LoginAttemp.findOne({ email }).sort({
      attemptedAt: -1,
    });

    const countAttempts = await LoginAttemp.find({ email }).countDocuments();
    const attempts = parseInt(countAttempts);
    console.log('attempts', attempts);
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lastAttemptTime = lastAttempt
        ? lastAttempt.attemptedAt.getTime()
        : 0;
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastAttemptTime;
      const thirtyMinutes = 1 * 60 * 1000; // 30 minutes in milliseconds

      if (timeDifference < thirtyMinutes) {
        await new UserLog({
          email,
          message:
            'mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.',
          successful: false,
          attemptTo: attempts + 1,
        }).save();

        throw errorResponder(
          errorTypes.TOO_MANY,
          'Try again in 30 minutes sir'
        );
      } else {
        await new UserLog({
          email,
          message:
            'bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0.',
          successful: false,
          attemptTo: 0,
        }).save();
        await LoginAttemp.deleteMany({ email });
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      await new LoginAttemp({ email, successful: false }).save();
      await new UserLog({
        email,
        message: 'gagal login coba lagi. Attemp = ' + (attempts + 1),
        successful: false,
        attemptTo: attempts + 1,
      }).save();

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    await LoginAttemp.deleteMany({ email });
    await new UserLog({
      email,
      message: 'Berhasil login',
      successful: true,
      attemptTo: 0,
    }).save();

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

async function register(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(
      name,
      email,
      password,
      'bank-customers'
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register,
};
