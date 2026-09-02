import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
    PORT: Joi.number().default(3000),

    DATABASE_URL: Joi.string().uri({ scheme: ['mysql'] }).required(),
    REDIS_URL: Joi.string().uri({ scheme: ['redis'] }).required(),

    JWT_ACCESS_SECRET: Joi.string().min(16).required(),
    JWT_REFRESH_SECRET: Joi.string().min(16).required(),
    JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

    MEILISEARCH_HOST: Joi.string().uri().required(),
    MEILISEARCH_API_KEY: Joi.string().required(),

    STORAGE_PROVIDER: Joi.string().valid('local', 'b2', 'r2').default('local'),
    STORAGE_BUCKET: Joi.string().allow('').optional(),
    STORAGE_ACCESS_KEY: Joi.string().allow('').optional(),
    STORAGE_SECRET_KEY: Joi.string().allow('').optional(),

    GOOGLE_OAUTH_CLIENT_ID: Joi.string().allow('').optional(),
    GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().allow('').optional(),
    FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),

    BACKEND_PUBLIC_URL: Joi.string().uri().optional(),
});