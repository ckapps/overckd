import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import { GetRecipeByNameEvent, RecipeQueryType } from './recipe.query';
import { RecipeRepositoryToken } from '../tokens';

const eventType = RecipeQueryType.GetByName;

/**
 * Effect to get recipe by name
 *
 * @param event$
 * @param ctx
 */
export const getRecipeByName: MsgEffect = (event$, ctx) => {
  const repo = useContext(RecipeRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetRecipeByNameEvent),
    act(eventValidator$(GetRecipeByNameEvent)),
    act(event =>
      pipe(
        event.payload.name,
        repo.getByName,
        x => from(x),
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
