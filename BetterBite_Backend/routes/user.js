const Joi = require("@hapi/joi");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

module.exports = [
  {
    method: "GET",
    path: "/user/me",
    handler: UserController.getCurrentUser,
    options: {
      pre: [{ method: authMiddleware }],
    },
  },
  {
    method: "POST",
    path: "/user/forgot-password",
    handler: UserController.forgotPassword,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/user/reset-password",
    handler: UserController.resetPassword,
    options: {
      validate: {
        payload: Joi.object({
          token: Joi.string().required(),
          newPassword: Joi.string().min(6).required(),
        }),
      },
    },
  },

  {
    method: "DELETE",
    path: "/user/account",
    handler: UserController.deleteAccount,
    options: {
      pre: [{ method: authMiddleware }],
    },
  },
];
