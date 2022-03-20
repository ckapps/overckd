import { mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import { createTag } from './tag.model';
import { CreateTagCommand } from './tag.command';
import { TagCreatedEvent } from './tag.event';
import { TagRepositoryToken } from '../tokens';

/**
 * Event effect for creating tag.
 *
 * @param event$ Event observable
 * @param ctx Event Context
 */
export const createTagEffect: MsgEffect = (event$, ctx) => {
  const repo = useContext(TagRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(CreateTagCommand),
    act(eventValidator$(CreateTagCommand)),
    act(event =>
      pipe(
        event.payload,
        createTag,
        repo.add,
        mergeMap(tag => [
          TagCreatedEvent.create(tag),
          reply(event)(TagCreatedEvent.create(tag)),
        ]),
      ),
    ),
  );
};
