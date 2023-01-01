import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  // auth-mongo-srv is the name of the service in the auth-mongo-depl.yml file
  // 27017 is the default port for mongo declared in the auth-mongo-depl.yml file
  // 'auth' is the name of the database. We don't have a DB yet, so it will be created automatically
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
}

start();