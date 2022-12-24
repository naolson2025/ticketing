import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      // first argument is the name of the channel
      // second argument is the data we want to publish
      // third argument is a callback function that will be 
      // executed when the event is published
      // nats will only accept strings
      // so we need to convert our data to a string
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        // if there is an error reject the promise
        // if there is no error then err will be null
        if (err) {
          return reject(err);
        }

        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
