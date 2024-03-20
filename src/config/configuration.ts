export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  sentryDsn: process.env.SENTRY_DSN || '',
  db: {
    type: process.env.DATABASE_TYPE,
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
  },
  auth: {
    secret: process.env.AUTH_JWT_SECRET_KEY,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
  },
});
