import { catchError, map, take, tap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { of } from 'rxjs';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { LogLevel } from '@overckd/domain';

import { GetRecipeByNameEvent, RecipeQueryType } from './recipe.query';
import { RecipeRepositoryToken, LogToken } from '../tokens';

const eventType = RecipeQueryType.GetByName;

/**
 * Effect to get recipe by name
 *
 * @param event$
 * @param ctx
 */
export const getRecipeByNameEffect: MsgEffect = (event$, ctx) => {
  const repo = useContext(RecipeRepositoryToken)(ctx.ask);
  const logger = useContext(LogToken)(ctx.ask);

  return event$.pipe(
    matchEvent(GetRecipeByNameEvent),
    act(eventValidator$(GetRecipeByNameEvent)),
    act(event =>
      pipe(
        event.payload.name,
        repo.getByName,
        tap(
          logger({
            prefixes: ['run:'],
            message: 'get-by-name',
            level: LogLevel.Debug,
            withArguments: false,
          }),
        ),
        take(1),
        map(payload => reply(event)({ type: `${eventType}_RESULT`, payload })),
        catchError(error =>
          of({
            type: `${eventType}_ERROR`,
            error: { name: error.name, message: error.message },
          }),
        ),
      ),
    ),
  );
};
