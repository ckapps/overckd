import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import {
  FindIngredientTagByQueryEvent,
  IngredientTagQueryType,
} from './ingredient-tag.query';
import { IngredientTagRepositoryToken } from '../tokens';

const eventType = IngredientTagQueryType.FindByQuery;

/**
 * Effect to get recipe by name
 *
 * @param event$
 * @param ctx
 */
export const findIngredientTagsByQuery: MsgEffect = (event$, ctx) => {
  const repo = useContext(IngredientTagRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(FindIngredientTagByQueryEvent),
    act(eventValidator$(FindIngredientTagByQueryEvent)),
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
