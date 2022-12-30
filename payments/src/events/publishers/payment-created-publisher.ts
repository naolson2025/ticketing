import { Subjects, Publisher, PaymentCreatedEvent } from '@nao2025tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}