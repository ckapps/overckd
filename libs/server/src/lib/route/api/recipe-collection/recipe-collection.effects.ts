import { useContext } from '@marblejs/core';
import { r } from '@marblejs/http';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import {
  GetAllRecipeCollectionsEvent,
  GetRecipeCollectionByIdEvent,
  RecipeCollectionIdDto,
} from '@overckd/domain-rx';
import * as Fn from 'effect/Function';
import { map, mergeMap } from 'rxjs';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------

/**
 * Validates request: `GET` byId
 */
const validateGetByIdRequest = requestValidator$({
  params: RecipeCollectionIdDto,
});

// ----------------------------------------------------------------------------
// Effects
// ----------------------------------------------------------------------------
/**
 * `GET` collections (all)
 */
export const getCollections$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      mergeMap(req => {
        return Fn.pipe(
          GetAllRecipeCollectionsEvent.create(),
          eventBusClient.send,
        );
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);

/**
 * `GET` collection by ID
 */
export const getCollectionsById$ = r.pipe(
  r.matchPath('/:id'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateGetByIdRequest,
      mergeMap(req => {
        return Fn.pipe(
          req.params,
          GetRecipeCollectionByIdEvent.create,
          eventBusClient.send,
        );
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);
