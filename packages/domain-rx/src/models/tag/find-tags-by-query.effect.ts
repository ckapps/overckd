import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import { map } from 'rxjs/operators';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { TagRepositoryToken } from '../../tokens';
import { FindTagByQueryEvent, TagQueryType } from './tag.query';

const createEvent = eventCreator(TagQueryType.FindByQuery);

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
        map(payload =>
          reply(event)(createEvent(OverckdEventType.Result, { payload })),
        ),
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
