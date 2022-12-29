import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

// ** create a new queue
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// ** this is the code that will be executed when a job is processed

// job is an object that wraps the payload
// it will have the payload and also other data about the job
// like the id & timestamp of the job
expirationQueue.process(async (job) => {
  // ** publish an event saying that this order has expired
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };