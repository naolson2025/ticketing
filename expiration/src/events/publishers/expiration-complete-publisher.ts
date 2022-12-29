import { Subjects, Publisher, ExpirationCompleteEvent } from "@nao2025tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}