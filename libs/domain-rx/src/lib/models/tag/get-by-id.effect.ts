import { TagUseCase } from '@_shared/tag/application';
import { act, matchEvent } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { TagFromJson, TagId } from '@overckd/domain-experimental';
import { Effect, Logger, LogLevel, Schema } from 'effect';
import * as Fn from 'effect/Function';
import { from, map } from 'rxjs';
import {
  eventCreator,
  OverckdEventType,
} from '../../core/events/event-creator';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { TagRepoMarbleInterop } from './tag.model';
import { GetTagByIdEvent, TagQueryType } from './tag.query';

const createEvent = eventCreator(TagQueryType.GetById);

export const getByIdEffect: MsgEffect = (event$, ctx) => {
  const findById = (id: TagId) =>
    TagUseCase.pipe(
      Effect.flatMap(useCases => useCases.findById(id)),
      Effect.flatMap(Schema.encode(TagFromJson)),
    ).pipe(
      Logger.withMinimumLogLevel(LogLevel.Debug),
      Effect.provide(TagUseCase.Default),
      Effect.provide(TagRepoMarbleInterop),
      Effect.provideService(MarbleJsContextProvider, ctx.ask),
    );

  return event$.pipe(
    matchEvent(GetTagByIdEvent),
    act(eventValidator$(GetTagByIdEvent)),
    act(event =>
      Fn.pipe(
        // @ts-ignore
        event.payload.uri,
        TagId.make,
        id => Effect.runPromise(findById(id)),
        p => from(p),
        map(payload =>
          reply(event)(createEvent(OverckdEventType.Result, { payload })),
        ),
        // catchError(error =>
        //   of({
        //     type: 'GET_USER_ERROR',
        //     error: { name: error.name, message: error.message },
        //   }),
        // ),
      ),
    ),
  );
};
