import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import { GetTagByIdEvent } from './tag.query';
import { TagRepositoryToken } from '../tokens';

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
