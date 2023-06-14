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
import { pipe } from 'fp-ts/function';
import { map, mergeMap } from 'rxjs/operators';
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
        pipe(FindTagByQueryEvent.create(query), eventBusClient.send),
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
        const { params } = req;

        return pipe(GetTagByIdEvent.create(params), eventBusClient.send);
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
        const { body } = req;

        return pipe(CreateTagCommand.create(body), eventBusClient.send);
      }),
      map(value => ({ body: value.payload })),
      // mapTo({ status: HttpStatus.OK, b }),
    );
  }),
);
