// Will start up a new instance of MongoDB in memory
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;
// this setup file will run before all the tests
beforeAll(async () => {
  // manually set the JWT_KEY environment variable for testing
  process.env.JWT_KEY = 'asdf'
  // create a server in memory
  mongo = await MongoMemoryServer.create();
  // get the uri of the server
  const mongoUri = mongo.getUri();
  // connect to the in memory server
  await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
  // reset the database before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  // close the connection to the in memory server
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
})