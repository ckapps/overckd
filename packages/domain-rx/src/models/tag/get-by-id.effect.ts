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
import { GetTagByIdEvent, TagQueryType } from './tag.query';

const createEvent = eventCreator(TagQueryType.GetById);

export const getByIdEffect: MsgEffect = (event$, ctx) => {
  const repo = useContext(TagRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetTagByIdEvent),
    act(eventValidator$(GetTagByIdEvent)),
    act(event =>
      pipe(
        event.payload.uri,
        repo.getByUri,
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
