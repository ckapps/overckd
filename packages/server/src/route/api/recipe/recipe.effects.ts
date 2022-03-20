import { r, HttpStatus, useContext, combineRoutes } from '@marblejs/core';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/lib/pipeable';

import { GetRecipeByNameEvent, RecipeNameDto } from '@overckd/domain-rx';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
/**
 * Validates request: `GET` byId
 */
const validateGetByNameRequest = requestValidator$({
  params: RecipeNameDto,
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
 * `GET` recipe by name
 */
const getRecipeByName$ = r.pipe(
  r.matchPath('/:name'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateGetByNameRequest,
      pluck('params'),
      mergeMap(params =>
        pipe(GetRecipeByNameEvent.create(params), eventBusClient.send),
      ),
      map(value =>
        value.payload === undefined
          ? { status: HttpStatus.NOT_FOUND }
          : { body: value.payload },
      ),
    );
  }),
);

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for recipes
 */
export const recipes$ = combineRoutes('/recipes', [getRecipeByName$]);
