const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  firstname: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(),
  lastname: Joi.string(),
});

const UserPayloadSchemaUpdate = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
});

module.exports = { UserPayloadSchema, UserPayloadSchemaUpdate };
