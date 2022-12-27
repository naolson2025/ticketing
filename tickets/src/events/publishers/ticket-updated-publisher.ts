import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@nao2025tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
