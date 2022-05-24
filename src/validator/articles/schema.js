const Joi = require("joi");

const ArticlePayloadSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required()
});

const ArticlePayloadSchemaUpdate = Joi.object({
  title: Joi.string(),
  body: Joi.string(),
  tags: Joi.array().items(Joi.string())
});

module.exports = { ArticlePayloadSchema, ArticlePayloadSchemaUpdate };
