import { Event } from '@marblejs/core';

export enum OverckdEventType {
  Result = `result`,
  Error = `error`,
}

export function createEvent<P = unknown, E = any, T extends string = string>(
  eventType: OverckdEventType,
  ev: Event<P, E, T>,
): Event<P, E, string> {
  const { ...others } = ev;

  return {
    ...others,
    type: [ev.type, eventType].join('.'),
  };
}
