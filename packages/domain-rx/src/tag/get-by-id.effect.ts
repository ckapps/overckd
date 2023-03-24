import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import { map } from 'rxjs/operators';
import { TagRepositoryToken } from '../tokens';
import { GetTagByIdEvent } from './tag.query';

export const getByIdEffect: MsgEffect = (event$, ctx) => {
  const repo = useContext(TagRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetTagByIdEvent),
    act(eventValidator$(GetTagByIdEvent)),
    act(event =>
      pipe(
        event.payload.uri,
        repo.getByUri,
        map(payload => reply(event)({ type: 'TAG.GET_BY_ID.RESULT', payload })),
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
