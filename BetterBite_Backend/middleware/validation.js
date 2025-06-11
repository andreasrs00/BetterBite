const Joi = require("@hapi/joi");
const { errorResponse } = require("../utils/response");

const validateRegistration = (request, h) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(request.payload);
  if (error) {
    return h.response(errorResponse(error.details[0].message, 400)).code(400);
  }

  return h.continue;
};

const validateLogin = (request, h) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(request.payload);
  if (error) {
    return h.response(errorResponse(error.details[0].message, 400)).code(400);
  }

  return h.continue;
};

const validateProfile = (request, h) => {
  const schema = Joi.object({
    nama: Joi.string().min(2).max(100).required(),
    tinggi: Joi.number().min(100).max(250).required(),
    berat: Joi.number().min(30).max(300).required(),
    usia: Joi.number().min(10).max(100).required(),
    // target: Joi.string().valid("diet", "bulking", "maintenance").required(),
    foto_profil: Joi.string()
      .pattern(/^data:image\/(png|jpeg|jpg);base64,/, {
        name: "data URI",
      })
      .optional(),
  });

  const { error } = schema.validate(request.payload);
  if (error) {
    return h.response(errorResponse(error.details[0].message, 400)).code(400);
  }

  return h.continue;
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfile,
};
