import nats from 'node-nats-streaming';

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
stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  // nats will only accept strings
  // so we need to convert our data to a string
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  // first argument is the name of the channel
  // second argument is the data we want to publish
  // third argument is a callback function that will be executed when the event is published
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});