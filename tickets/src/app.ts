import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@nao2025tickets/common';
import { createTicketRouter } from './routes/new';

const app = express();
// traffic is being proxied to our service through ingress-nginx
// this way express knows it's being proxied and should trust the traffic
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // signed means that the cookie is encrypted
    // set it to false here because we are using JWT inside the cookie
    // the JWT is already encrypted
    signed: false,
    // if true means that the cookie can only be used over https
    // we want this to be false in a test environment to jest can check the cookie
    secure: process.env.NODE_ENV !== 'test',
  })
);

// add middleware to check if user is signed in
// will run before every request
app.use(currentUser);

app.use(createTicketRouter);

// will watch for all types of requests: get, post, put, delete, etc.
// catch all route handler
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
