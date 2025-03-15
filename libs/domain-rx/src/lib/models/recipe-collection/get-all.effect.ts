import { RecipeCollectionUseCase } from '@_shared/recipe-collection/application';
import { act, matchEvent } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { Effect, Logger, LogLevel } from 'effect';
import * as Fn from 'effect/Function';
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
  const getAll = RecipeCollectionUseCase.getAll.pipe(
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.provide(RecipeCollectionRepoMarbleInterop),
    Effect.provideService(MarbleJsContextProvider, ctx.ask),
  );

  return event$.pipe(
    matchEvent(GetAllRecipeCollectionsEvent),
    act(event =>
      Fn.pipe(
        undefined,
        () => Effect.runPromise(getAll),
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
