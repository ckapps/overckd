import { LogLevel } from '@ckapp/rxjs-snafu/lib/cjs/log';
import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import { of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { LogToken, RecipeRepositoryToken } from '../../tokens';
import { GetRecipeByNameEvent, RecipeQueryType } from './recipe.query';

const createEvent = eventCreator(RecipeQueryType.GetByName);

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
