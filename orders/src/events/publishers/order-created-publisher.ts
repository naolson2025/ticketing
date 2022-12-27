import { Publisher, OrderCreatedEvent, Subjects } from '@nao2025tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
