import { catchError, map, take, tap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { of } from 'rxjs';
import { LogLevel } from '@ckapp/rxjs-snafu/lib/cjs/log';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { GetRecipeByNameEvent, RecipeQueryType } from './recipe.query';
import { RecipeRepositoryToken, LogToken } from '../../tokens';

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
