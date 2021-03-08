import { r, HttpStatus, useContext } from '@marblejs/core';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'fp-ts/lib/pipeable';

import {
  RecipeCollectionDto,
  RecipeCollectionIdDto,
  GetAllRecipeCollectionsEvent,
  GetRecipeCollectionByIdEvent,
  CreateRecipeCollectionCommand,
} from '@overckd/domain-rx';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
/**
 * Validates request: `POST`
 */
const validatePostRequest = requestValidator$({
  body: RecipeCollectionDto,
});

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
        return pipe(GetAllRecipeCollectionsEvent.create(), eventBusClient.send);
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);

/**
 * `POST` collection
 */
export const postRecipeCollection$ = r.pipe(
  r.matchPath('/'),
  r.matchType('POST'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validatePostRequest,
      mergeMap(req => {
        const { body } = req;

        return pipe(
          CreateRecipeCollectionCommand.create(body),
          eventBusClient.send,
        );
      }),
      mapTo({ status: HttpStatus.CREATED }),
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
        const { params } = req;

        return pipe(
          GetRecipeCollectionByIdEvent.create(params),
          eventBusClient.send,
        );
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);
