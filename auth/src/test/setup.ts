// Will start up a new instance of MongoDB in memory
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// help typescript to understand that we have a declared a global signin function
declare global {
  var signup: () => Promise<string[]>;
}

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

// setting up a global variable, it will only be available in the test environment
// The purpose of this global function is to sign in a user and get the cookie
// this way we don't need to manually sign in a user in each test
global.signup = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201)

  const cookie = response.get('Set-Cookie')
  return cookie
}