import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

// we are going to randomly generate a client id
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // the second argument is the queue group name
  // if we have multiple instances of the listener running
  // nats will only send one message to one of the instances
  // this distributes the load across all the instances
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group'
  );

  subscription.on('message', (msg: Message) => {
    // msg.getData() pulls the data off the message
    // all messages are sent as strings
    // so we need to convert it back to JSON
    const data = msg.getData();

    if (typeof data === 'string') {
      // getSequence() is the order in which the message was published
      // it starts at 1 and increments by 1 for each message
      // basically counting the number of messages published
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
