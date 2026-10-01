import { act, matchEvent } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { Compat, RecipeId } from '@overckd/domain-experimental';
import { RecipeQueries, RecipeQueriesLocal } from '@overckd/recipe/application';
import { Effect, Function as Fn, References, Schema } from 'effect';
import { catchError, from, map, of } from 'rxjs';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeRepoMarbleInterop } from './recipe.model';
import { GetRecipeByNameEvent, RecipeQueryType } from './recipe.query';

const createEvent = eventCreator(RecipeQueryType.GetByName);

/**
 * Effect to get recipe by name
 *
 * @param event$
 * @param ctx
 */
export const getRecipeByNameEffect: MsgEffect = (event$, ctx) => {
  // Legacy recipes have their name as id.
  const findByName = (name: string) =>
    RecipeQueries.pipe(
      Effect.flatMap(queries => queries.findById({ id: RecipeId.make(name) })),
      Effect.flatMap(Schema.encodeEffect(Compat.RecipePreparationLegacyJson)),
      // The route answers 404 for a reply without payload.
      Effect.catchTag('RecipeNotFound', () => Effect.succeed(undefined)),
    ).pipe(
      Effect.provideService(References.MinimumLogLevel, 'Debug'),
      Effect.provide(RecipeQueriesLocal),
      Effect.provide(RecipeRepoMarbleInterop),
      Effect.provideService(MarbleJsContextProvider, ctx.ask),
    );

  return event$.pipe(
    matchEvent(GetRecipeByNameEvent),
    act(eventValidator$(GetRecipeByNameEvent)),
    act(event =>
      Fn.pipe(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        event.payload.name,
        name => Effect.runPromise(findByName(name)),
        result => from(result),
        map(payload =>
          reply(event)(createEvent(OverckdEventType.Result, { payload })),
        ),
        catchError(error =>
          of(
            createEvent(OverckdEventType.Error, {
              error: { name: error.name, message: error.message },
            }),
          ),
        ),
      ),
    ),
  );
};
