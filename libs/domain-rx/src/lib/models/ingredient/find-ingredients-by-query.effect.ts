import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/function';
import { map } from 'rxjs/operators';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { IngredientRepositoryToken } from '../../tokens';
import {
  FindIngredientByQueryEvent,
  IngredientQueryType,
} from './ingredient.query';

const createEvent = eventCreator(IngredientQueryType.FindByQuery);

/**
 * Effect to get recipe by name
 *
 * @param event$
 * @param ctx
 */
export const findIngredientsByQuery: MsgEffect = (event$, ctx) => {
  const repo = useContext(IngredientRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(FindIngredientByQueryEvent),
    act(eventValidator$(FindIngredientByQueryEvent)),
    act(event =>
      pipe(
        event.payload,
        repo.findByQuery,
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
