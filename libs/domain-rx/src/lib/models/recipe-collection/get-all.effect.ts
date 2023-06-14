import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { pipe } from 'fp-ts/function';
import { map } from 'rxjs/operators';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { RecipeCollectionRepositoryToken } from '../../tokens';
import {
  GetAllRecipeCollectionsEvent,
  RecipeCollectionQueryType,
} from './recipe-collection.query';

const createEvent = eventCreator(RecipeCollectionQueryType.GetAll);

export const getAll: MsgEffect = (event$, ctx) => {
  const repo = useContext(RecipeCollectionRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetAllRecipeCollectionsEvent),
    act(event =>
      pipe(
        undefined,
        repo.getAll,
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
