import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@nao2025tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // Find the ticket by id and version
    // if the incoming update is not the next version in sequence
    // then it will return null and that event will not be processed
    // the event will be requeued by nats and processed later
    // findByEvent is a custom static method on the Ticket model
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}