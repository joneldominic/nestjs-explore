import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'https://tw2nfPd46KcVUxoY77svrdwK@s1624869.eu-nbg-2.betterstackdata.com/1',
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
});
