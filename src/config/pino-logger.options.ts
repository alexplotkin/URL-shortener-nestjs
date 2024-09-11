import { Params } from 'nestjs-pino';

export const PinoLoggerOptions: Params = {
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
      },
    },
  },
};
