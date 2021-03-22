import { r, HttpStatus, useContext } from '@marblejs/core';
import { map, mergeMap } from 'rxjs/operators';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/lib/pipeable';

import { FindTagByQueryEvent, FlattenTagByQueryDto } from '@overckd/domain-rx';
import { unflattenQuery } from '@overckd/domain-rx/dist/search';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
/**
 * Validates request: `GET` find by query
 */
const validateFindByQueryRequest = requestValidator$({
  query: FlattenTagByQueryDto,
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
export const findTagsByQuery$ = r.pipe(
  r.matchPath('/query'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateFindByQueryRequest,
      mergeMap(req => {
        const params = unflattenQuery(req.query);

        return pipe(FindTagByQueryEvent.create(params), eventBusClient.send);
      }),
      map(value =>
        value.payload === undefined
          ? { status: HttpStatus.NOT_FOUND }
          : { body: value.payload },
      ),
    );
  }),
);