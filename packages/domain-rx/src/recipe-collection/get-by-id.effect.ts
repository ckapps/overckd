import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import { map } from 'rxjs/operators';
import { RecipeCollectionRepositoryToken } from '../tokens';
import { GetRecipeCollectionByIdEvent } from './recipe-collection.query';

export const getById: MsgEffect = (event$, ctx) => {
  const repo = useContext(RecipeCollectionRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetRecipeCollectionByIdEvent),
    act(eventValidator$(GetRecipeCollectionByIdEvent)),
    act(event =>
      pipe(
        event.payload.id,
        repo.getById,
        map(payload =>
          reply(event)({ type: 'GET_COLLECTION_RESULT', payload }),
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
