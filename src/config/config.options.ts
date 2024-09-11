import * as Joi from 'joi';
import config from './config';
import { ConfigModuleOptions } from '@nestjs/config';

export const ConfigModuleOpt: ConfigModuleOptions = {
  load: [config],
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    MONGODB_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    CACHE_TTL: Joi.number().required(),
    RATE_LIMIT_TTL: Joi.number().required(),
    RATE_LIMIT: Joi.string().required(),
  }),
};
