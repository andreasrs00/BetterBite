const Joi = require("@hapi/joi");
const ProfileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/auth");

module.exports = [
  {
    method: "POST",
    path: "/profile",
    handler: ProfileController.createProfile,
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        payload: Joi.object({
          nama: Joi.string().min(2).max(100).required(),
          tinggi: Joi.number().min(100).max(250).required(),
          berat: Joi.number().min(30).max(300).required(),
          usia: Joi.number().min(10).max(100).required(),
          target: Joi.string().valid("Diet", "Bulking", "Maintenance").optional(), // Pastikan case sensitif sesuai ENUM di DB
          foto_profil: Joi.string()
            .pattern(/^data:image\/(png|jpeg|jpg);base64,/, {
              name: "data URI",
            })
            .optional(),
        }),
      },
      payload: { // Ditambahkan untuk batas ukuran payload
        maxBytes: 10 * 1024 * 1024, // Contoh: 10 MB (sesuaikan sesuai kebutuhan Anda)
        output: 'data',
        parse: true,
        allow: 'application/json'
      }
    },
  },
  {
    method: "GET",
    path: "/profile",
    handler: ProfileController.getProfile,
    options: {
      pre: [{ method: authMiddleware }],
    },
  },
  {
    method: "PUT",
    path: "/profile",
    handler: ProfileController.updateProfile,
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        payload: Joi.object({
          nama: Joi.string().min(2).max(100).optional(), // Optional karena ini update
          tinggi: Joi.number().min(100).max(250).optional(),
          berat: Joi.number().min(30).max(300).optional(),
          usia: Joi.number().min(10).max(100).optional(),
          target: Joi.string().valid("Diet", "Bulking", "Maintenance").optional(),
          foto_profil: Joi.string()
            .pattern(/^data:image\/(png|jpeg|jpg);base64,/, {
              name: "data URI",
            })
            .optional(),
        }),
      },
      payload: { // Ditambahkan untuk batas ukuran payload
        maxBytes: 10 * 1024 * 1024, // Contoh: 10 MB
        output: 'data',
        parse: true,
        allow: 'application/json'
      }
    },
  },
  {
    method: "GET",
    path: "/profile/recommendation",
    handler: ProfileController.getRecommendation,
    options: {
      pre: [{ method: authMiddleware }],
    },
  },
];