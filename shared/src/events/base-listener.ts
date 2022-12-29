import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

// whenever we try to extend listener, we need to provide a custom type
// now we can refer to type T inside the class
export abstract class Listener<T extends Event> {
  // abstract means that this property must be defined
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  protected client: Stan;
  // protected means that this property can be accessed by
  // any class that extends this class
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
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
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    // the second argument is the queue group name
    // if we have multiple instances of the listener running
    // nats will only send one message to one of the instances
    // this distributes the load across all the instances
    // first argument is the channel we're subscribing to
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    // msg.getData() pulls the data off the message
    // all messages are sent as strings
    // so we need to convert it back to JSON
    const data = msg.getData();

    // data can be a string or buffer, we only want to process
    // if it is a string
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')); // how to parse a buffer
  }
}