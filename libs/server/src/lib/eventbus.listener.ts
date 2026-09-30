import { messagingListener } from '@marblejs/messaging';

import { domainEventEffects$ } from '@overckd/domain-rx';

// Set up the event bus listener
export const eventBusListener = messagingListener({
  effects: [domainEventEffects$],
});
