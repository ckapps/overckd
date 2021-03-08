import { r, HttpStatus, useContext } from '@marblejs/core';
import { map, mergeMap } from 'rxjs/operators';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/lib/pipeable';

import {
  FindIngredientTagByQueryEvent,
  FlattenIngredientTagByQueryDto,
} from '@overckd/domain-rx';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
/**
 * Validates request: `GET` find by query
 */
const validateFindByQueryRequest = requestValidator$({
  query: FlattenIngredientTagByQueryDto,
});

// ----------------------------------------------------------------------------
// Effects
// ----------------------------------------------------------------------------
/**
 * `GET` all recipes
 */
// export const getRecipes$ = r.pipe(
//   r.matchPath('/'),
//   r.matchType('GET'),
//   r.useEffect((req$, ctx) => {
//     const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

//     return req$.pipe(
//       mergeMap(req => {
//         return pipe(GetAllRecipeCollectionsEvent.create(), eventBusClient.send);
//       }),
//       map(value => ({ body: value.payload })),
//       // mapTo({ status: HttpStatus.OK, b }),
//     );
//   }),
// );

/**
 * `GET` Query ingredients
 */
export const findIngredientTagsByQuery$ = r.pipe(
  r.matchPath('/query'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateFindByQueryRequest,
      mergeMap(req => {
        const {
          query: { size, page, ...query },
        } = req;
        const params = { size, page, query };

        return pipe(
          FindIngredientTagByQueryEvent.create(params),
          eventBusClient.send,
        );
      }),
      map(value =>
        value.payload === undefined
          ? { status: HttpStatus.NOT_FOUND }
          : { body: value.payload },
      ),
    );
  }),
);
