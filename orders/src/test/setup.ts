// Will start up a new instance of MongoDB in memory
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Ticket, TicketDoc } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';

// help typescript to understand that we have a declared a global signin function
declare global {
  var signup: () => string[];
  var createTicket: () => Promise<TicketDoc>;
  var createOrder: (ticket: TicketDoc) => Promise<any>;
}

jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();
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
// The purpose of this global function is to return a cookie
// for a user that has been signed up

// create a fake cookie for use in testing
global.signup = () => {
  // buid a JWT payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object { jwt: MY_JWT }
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
}

global.createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();
  return ticket;
}

global.createOrder = async (ticket) => {
  const order = Order.build({
    ticket,
    userId: 'asdf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();
  return order;
};