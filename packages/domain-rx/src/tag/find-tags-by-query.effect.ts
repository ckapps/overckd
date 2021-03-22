import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import { FindTagByQueryEvent, TagQueryType } from './tag.query';
import { TagRepositoryToken } from '../tokens';

const eventType = TagQueryType.FindByQuery;

/**
 * Effect to get recipe by name
 *
 * @param event$
 * @param ctx
 */
export const findTagsByQuery: MsgEffect = (event$, ctx) => {
  const repo = useContext(TagRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(FindTagByQueryEvent),
    act(eventValidator$(FindTagByQueryEvent)),
    act(event =>
      pipe(
        event.payload,
        repo.findByQuery,
        map(payload => reply(event)({ type: `${eventType}_RESULT`, payload })),
        // catchError(error =>
        //   of({
        //     type: 'GET_USER_ERROR',
        //     error: { name: error.name, message: error.message },
        //   }),
        // ),
      ),
    ),
  );
};
