import { useContext } from '@marblejs/core';
import { combineRoutes, HttpStatus, r } from '@marblejs/http';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import { GetRecipeByNameEvent, RecipeNameDto } from '@overckd/domain-rx';
import { pipe } from 'fp-ts/function';
import { map, mergeMap } from 'rxjs/operators';

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
      map(x => x.params),
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
