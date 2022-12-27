import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// stan is nats spelled backwards
// its the community standard for naming the nats client
// here abc is the client id, nats will keep a list of all the clients
// that are connected to the cluster
// if we want to scale our app, we can have multiple instances of publisher
// and each instance will need a different client id
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// this function will be executed when the client connects to the nats server
stan.on('connect', async () => {
  console.log('Publisher connected to NATS');
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
      userId: '1234',
    });
  } catch (error) {
    console.error(error);
  }
});