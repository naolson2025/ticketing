import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@nao2025tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
