import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import { mergeMap } from 'rxjs/operators';
import { TagRepositoryToken } from '../tokens';
import { CreateTagCommand } from './tag.command';
import { TagCreatedEvent } from './tag.event';
import { createTag } from './tag.model';

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
