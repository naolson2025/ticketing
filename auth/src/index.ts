import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// will watch for all types of requests: get, post, put, delete, etc.
app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

const start = async () => {
  // auth-mongo-srv is the name of the service in the auth-mongo-depl.yml file
  // 27017 is the default port for mongo declared in the auth-mongo-depl.yml file
  // 'auth' is the name of the database. We don't have a DB yet, so it will be created automatically
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
}

start();