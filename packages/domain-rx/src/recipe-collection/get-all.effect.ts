import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import { GetAllRecipeCollectionsEvent } from './recipe-collection.query';
import { RecipeCollectionRepositoryToken } from '../tokens';

export const getAll: MsgEffect = (event$, ctx) => {
  const repo = useContext(RecipeCollectionRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetAllRecipeCollectionsEvent),
    act(event =>
      pipe(
        undefined,
        repo.getAll,
        x => from(x),
        map(payload =>
          reply(event)({ type: 'GET_ALL_COLLECTION_RESULT', payload }),
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
