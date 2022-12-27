import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@nao2025tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
