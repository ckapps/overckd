import { CollectionUseCase } from '@overckd/collection/application';
import { act, matchEvent } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { CollectionJson } from '@overckd/domain-experimental';
import { Effect, Function as Fn, References, Schema } from 'effect';
import { from, map } from 'rxjs';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeCollectionRepoMarbleInterop } from './recipe-collection.model';
import {
  GetAllRecipeCollectionsEvent,
  RecipeCollectionQueryType,
} from './recipe-collection.query';

const createEvent = eventCreator(RecipeCollectionQueryType.GetAll);

export const getAll: MsgEffect = (event$, ctx) => {
  const getAll = CollectionUseCase.pipe(
    Effect.flatMap(useCases => useCases.getAll),
    Effect.flatMap(Schema.encodeEffect(Schema.Array(CollectionJson))),
  ).pipe(
    Effect.provideService(References.MinimumLogLevel, 'Debug'),
    Effect.provide(CollectionUseCase.layer),
    Effect.provide(RecipeCollectionRepoMarbleInterop),
    Effect.provideService(MarbleJsContextProvider, ctx.ask),
  );

  return event$.pipe(
    matchEvent(GetAllRecipeCollectionsEvent),
    act(event =>
      Fn.pipe(
        Effect.runPromise(getAll),
        result => from(result),
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
