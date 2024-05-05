const model = {
  email: {
    type: String,
    required: true,
  },
  successful: {
    type: Boolean,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
};

module.exports = model;
