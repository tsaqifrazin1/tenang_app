const InvariantError = require('../../exceptions/InvariantError');
const { ArticlePayloadSchema, ArticlePayloadSchemaUpdate } = require('./schema')

const ArticlesValidator = {
    validateArticlePayload : (payload) => {
        const validationResult = ArticlePayloadSchema.validate(payload);
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateArticlePayloadUpdate : (payload) => {
        const validationResult = ArticlePayloadSchemaUpdate.validate(payload);
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
};

module.exports = ArticlesValidator;