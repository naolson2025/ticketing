import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// traffic is being proxied to our service through ingress-nginx
// this way express knows it's being proxied and should trust the traffic
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  // signed means that the cookie is encrypted
  // set it to false here because we are using JWT inside the cookie
  // the JWT is already encrypted
  signed: false,
  // these means that the cookie can only be used over https
  secure: true
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// will watch for all types of requests: get, post, put, delete, etc.
app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app };
