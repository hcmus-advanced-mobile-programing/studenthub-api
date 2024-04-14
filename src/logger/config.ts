import { HEADER } from 'src/shared/constant/request';

const LOG_LVL = process.env.LOG_LVL || 'debug';

const loggerConfig = {
  imports: [],
  inject: [],
  useFactory: () => {
    return {
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'error' : LOG_LVL,
        genReqId(req) {
          return req.headers[HEADER.X_REQUEST_ID];
        },
        serializers: {
          req(req) {
          },
          query(query) {
            if (process.env.NODE_ENV === 'production') {
              return '[Hidden SQL query]';
            }
            return query;
          }
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd'T'HH:mm:ss.l'Z'",
            messageFormat: '{req.id} [{context}] {msg}',
            singleLine: true,
            errorLikeObjectKeys: ['err', 'error'],
          },
        },
      },
    };
  },
};

export default loggerConfig;
