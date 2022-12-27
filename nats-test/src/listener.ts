import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

// console.clear();

// we are going to randomly generate a client id
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // this function will be executed when the client disconnects from the nats server
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// this function will be executed when the client disconnects from the nats server
// SIGINT is a signal that is sent when we press ctrl + c (signal interuption)
// these tell nats to close the connection
// so it doesn't try to send any more messages
process.on('SIGINT', () => stan.close());
// SIGTERM is signal terminated
process.on('SIGTERM', () => stan.close());