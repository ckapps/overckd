import { Event, EventMetadata, EventType } from '@marblejs/core';
import { createEvent, OverckdEventType } from './create-event';

export { OverckdEventType };

export interface EventWithPayload<P = unknown> {
  payload: P;
  metadata?: EventMetadata;
}

export interface EventWithError<E = unknown> {
  error: E;
  metadata?: EventMetadata;
}

type EventData<P = unknown, E = any> = EventWithPayload<P> | EventWithError<E>;

export function eventCreator<
  P = unknown,
  E = any,
  T extends EventType = EventType,
>(
  eventType: T,
): (
  eventType: OverckdEventType,
  event: EventData<P, E>,
) => Event<P, E, string> {
  return (_, ev) =>
    createEvent(_, {
      ...ev,
      type: eventType,
    });
}

eventCreator('test')(OverckdEventType.Error, { payload: 'test' });
