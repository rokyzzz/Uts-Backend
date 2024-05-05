const usersSchema = {
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  successful: {
    type: Boolean,
    required: true,
  },
  attemptTo: {
    type: Number,
    required: false,
  },
};

module.exports = usersSchema;

module.exports = usersSchema;
