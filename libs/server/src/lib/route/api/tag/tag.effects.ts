import { useContext } from '@marblejs/core';
import { r } from '@marblejs/http';
import { EventBusClientToken } from '@marblejs/messaging';
import { requestValidator$ } from '@marblejs/middleware-io';
import { GetTagByIdEvent, UriIdQueryDto } from '@overckd/domain-rx';
import * as Fn from 'effect/Function';
import { map, mergeMap } from 'rxjs';

// ----------------------------------------------------------------------------
// Validators
// ----------------------------------------------------------------------------
/**
 * Validates request: `GET` byId
 */
const validateGetByIdRequest = requestValidator$({
  params: UriIdQueryDto,
});

// ----------------------------------------------------------------------------
// Effects
// ----------------------------------------------------------------------------
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
