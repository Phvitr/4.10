import express from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

const PORT = 3000;
const app = express();

Sentry.init({
    dsn: 'https://0852200ea5e14fda9b3d75bd0cf075aa@o4504755218153472.ingest.sentry.io/4504755221168128',
    integrations: [
        new Sentry.Integrations.Http({tracing: true}),
        new Tracing.Integrations.Express({app}),
    ],
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get('/', function rootHandler(req, res) {
    res.send('Hello World!');
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.senntry + "\n");
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
});

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}/debug-sentry`);
});