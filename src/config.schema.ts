import * as joi from '@hapi/joi';

export const configValidationSchema = joi.object({
    MONGODB_URI: joi.string().required(),
    MONGODB_USER: joi.string().required(),
    MONGODB_PASSWORD: joi.string().required(),
    MONGODB_DATABASE: joi.string().required(),
})