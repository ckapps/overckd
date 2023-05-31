import { useContext } from '@marblejs/core';
import { HttpStatus, r } from '@marblejs/http';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import {
  FindIngredientByQueryEvent,
  FlattenIngredientByQueryDto,
} from '@overckd/domain-rx';
import { unflattenQuery } from '@overckd/domain-rx/dist/search';
import { pipe } from 'fp-ts/function';
import { map, mergeMap } from 'rxjs/operators';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
/**
 * Validates request: `GET` byId
 */
const validateFindByQueryRequest = requestValidator$({
  query: FlattenIngredientByQueryDto,
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
 * Query ingredients
 *
 * Method: `GET`
 */
export const findIngredientByQuery$ = r.pipe(
  r.matchPath('/query'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateFindByQueryRequest,
      mergeMap(req => {
        const params = unflattenQuery(req.query);

        return pipe(
          FindIngredientByQueryEvent.create(params),
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
