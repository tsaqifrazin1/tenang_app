const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema, UserPayloadSchemaUpdate } = require('./schema')

const UsersValidator = {
    validateUserPayload : (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateUserPayloadUpdate : (payload) => {
        const validationResult = UserPayloadSchemaUpdate.validate(payload);
        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
};

module.exports = UsersValidator;