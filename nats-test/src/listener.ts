import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

  // to set options we chain the subscriptionOptions method
  // we can set the manual ack mode to true
  // this means we have to manually acknowledge the message
  // if we don't do this, the message will be redelivered
  // this is useful if the service crashes and the message is not processed
  // this will send all event history to the listener when it restarts
  // long term this isnt a good idea, because the histroy will pile up
  // the durable name, nats will keep track of which messages have been processed
  // by a service, and only send the messages that have not been processed
  // when that service restarts
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');

  // the second argument is the queue group name
  // if we have multiple instances of the listener running
  // nats will only send one message to one of the instances
  // this distributes the load across all the instances
  const subscription = stan.subscribe(
    // first argument is the channel we're subscribing to
    'ticket:created',
    'orders-service-queue-group',
    options
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

    // we need to manually acknowledge the message
    // this tells nats that we have processed the message
    // if we don't do this, the message will be redelivered
    msg.ack();
  });
});

// this function will be executed when the client disconnects from the nats server
// SIGINT is a signal that is sent when we press ctrl + c (signal interuption)
// these tell nats to close the connection
// so it doesn't try to send any more messages
process.on('SIGINT', () => stan.close());
// SIGTERM is signal terminated
process.on('SIGTERM', () => stan.close());