import { Publisher } from '@nao2025tickets/common';
import { TicketCreatedEvent } from '@nao2025tickets/common';
import { Subjects } from '@nao2025tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}