import { RecipeCollectionUseCase } from '@_shared/recipe-collection/application';
import { act, matchEvent } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import {
  RecipeCollectionId,
  RecipeCollectionJson,
} from '@overckd/domain-experimental';
import { Effect, Logger, LogLevel, Schema } from 'effect';
import { pipe } from 'effect/Function';
import { from, map } from 'rxjs';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeCollectionRepoMarbleInterop } from './recipe-collection.model';
import {
  GetRecipeCollectionByIdEvent,
  RecipeCollectionQueryType,
} from './recipe-collection.query';

const createEvent = eventCreator(RecipeCollectionQueryType.GetById);

export const getById: MsgEffect = (event$, ctx) => {
  const findById = (id: RecipeCollectionId) =>
    RecipeCollectionUseCase.findById(id)
      .pipe(Effect.flatMap(Schema.encode(RecipeCollectionJson)))
      .pipe(
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.provide(RecipeCollectionRepoMarbleInterop),
        Effect.provideService(MarbleJsContextProvider, ctx.ask),
      );

  return event$.pipe(
    matchEvent(GetRecipeCollectionByIdEvent),
    act(eventValidator$(GetRecipeCollectionByIdEvent)),
    act(event =>
      pipe(
        // @ts-ignore
        event.payload.id,
        RecipeCollectionId.make,
        id => Effect.runPromise(findById(id)),
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
