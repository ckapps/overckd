import { Event } from '@marblejs/core';

export enum OverckdEventType {
  Result = `RESULT`,
  Error = `ERROR`,
}

export function createEvent<P = unknown, E = any, T extends string = string>(
  eventType: OverckdEventType,
  ev: Event<P, E, T>,
): Event<P, E, string> {
  const { ...others } = ev;

  return {
    ...others,
    type: [ev.type, eventType].join('_'),
  };
}
