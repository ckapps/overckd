import { TagRepo } from '@_shared/tag/application';
import { useContext } from '@marblejs/core';
import {
  TagFromObject,
  TagId,
  TagNotFound,
} from '@overckd/domain-experimental';
import { Effect, Layer, Option, Schema } from 'effect';
import * as Fn from 'effect/Function';
import { firstValueFrom } from 'rxjs';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { TagRepositoryToken } from '../models.tokens';

export const TagRepoMarbleInterop = Layer.effect(
  TagRepo,
  Effect.gen(function* () {
    const ctx = yield* MarbleJsContextProvider;
    const repo = useContext(TagRepositoryToken)(ctx);
    const decode = Schema.decodeSync(TagFromObject);

    return {
      findById: (id: TagId) =>
        Fn.pipe(
          Effect.promise(() => firstValueFrom(repo.getByUri(id))),
          Effect.map(Option.fromNullable),
          Effect.flatten,
          Effect.tap(baseTag => Effect.logDebug('baseTag', baseTag)),
          Effect.map(decode),
          Effect.mapError(() => TagNotFound.make({ id })),
        ),
    };
  }),
);
