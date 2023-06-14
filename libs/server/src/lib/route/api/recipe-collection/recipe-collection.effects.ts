import { useContext } from '@marblejs/core';
import { HttpStatus, r } from '@marblejs/http';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import {
  CreateRecipeCollectionCommand,
  GetAllRecipeCollectionsEvent,
  GetRecipeCollectionByIdEvent,
  RecipeCollectionDto,
  RecipeCollectionIdDto,
} from '@overckd/domain-rx';
import { pipe } from 'fp-ts/function';
import { map, mergeMap } from 'rxjs/operators';

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
      map(() => ({ status: HttpStatus.CREATED })),
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
