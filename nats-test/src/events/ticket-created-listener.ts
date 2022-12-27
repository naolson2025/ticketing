import { Listener } from '@nao2025tickets/common';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@nao2025tickets/common';
import { Subjects } from '@nao2025tickets/common';

// by adding TicketCreatedEvent here we can use TS to
// enforce the structure of the msg
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // readonly means that this property can only be set once
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  // enforce the ticket:created data structure
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    // we need to manually acknowledge the message
    // this tells nats that we have processed the message
    // if we don't do this, the message will be redelivered
    msg.ack();
  }
}