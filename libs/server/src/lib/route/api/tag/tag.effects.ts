import { useContext } from '@marblejs/core';
import { HttpStatus, r } from '@marblejs/http';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$, t } from '@marblejs/middleware-io';
import {
  CreateTagCommand,
  FindTagByQueryEvent,
  GetTagByIdEvent,
  TagDto,
  UriIdQueryDto,
} from '@overckd/domain-rx';
import * as Fn from 'effect/Function';
import { map, mergeMap } from 'rxjs';
import { transformFromRequestProperty } from '../../../core/search/transform-from-request-property.operator';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
const FlattenTagByQueryStringDto = t.partial({
  label: t.string,
  page: t.string,
  size: t.string,
});
/**
 * Validates request: `GET` find by query
 */
const validateFindByQueryRequest = requestValidator$({
  query: FlattenTagByQueryStringDto,
});

/**
 * Validates request: `GET` byId
 */
const validateGetByIdRequest = requestValidator$({
  params: UriIdQueryDto,
});

/**
 * Validates request: `GET` byId
 */
const validateCreateRequest = requestValidator$({
  body: TagDto,
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
 * `GET` Query tag
 */
export const findTagsByQuery$ = r.pipe(
  r.matchPath('/query'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateFindByQueryRequest,
      transformFromRequestProperty('query'),
      mergeMap(query =>
        Fn.pipe(query, FindTagByQueryEvent.create, eventBusClient.send),
      ),
      map(value =>
        value.payload === undefined
          ? { status: HttpStatus.NOT_FOUND }
          : { body: value.payload },
      ),
    );
  }),
);

/**
 * `GET` tag by ID
 */
export const getTagByUri$ = r.pipe(
  r.matchPath('/:uri'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateGetByIdRequest,
      mergeMap(req => {
        return Fn.pipe(req.params, GetTagByIdEvent.create, eventBusClient.send);
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);

export const createTag$ = r.pipe(
  r.matchPath('/'),
  r.matchType('POST'),
  r.useEffect((req$, ctx) => {
    const eventBusClient = useContext(EventBusClientToken)(ctx.ask);

    return req$.pipe(
      validateCreateRequest,
      mergeMap(req => {
        return Fn.pipe(req.body, CreateTagCommand.create, eventBusClient.send);
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);
