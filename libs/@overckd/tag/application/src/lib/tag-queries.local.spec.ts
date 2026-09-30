import { Tag, TagId, TagNotFound } from '@overckd/domain-experimental';
import { Effect, Layer, Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { TagQueries } from './tag-queries';
import { TagQueriesLocal } from './tag-queries.local';
import { TagRepo } from './tag-repo';

const vegan = Tag.make({
  uri: TagId.make('vegan'),
  label: 'Vegan',
  icon: Option.none(),
});

describe('TagQueriesLocal', () => {
  it('finds a tag by its id', async () => {
    const repo = Layer.mock(TagRepo, {
      findById: () => Effect.succeed(vegan),
    });

    const tag = await Effect.runPromise(
      TagQueries.use(queries => queries.findById(vegan.uri)).pipe(
        Effect.provide(TagQueriesLocal.pipe(Layer.provide(repo))),
      ),
    );

    expect(tag).toEqual(vegan);
  });

  it('fails with TagNotFound for unknown ids', async () => {
    const repo = Layer.mock(TagRepo, {
      findById: id => Effect.fail(new TagNotFound({ id })),
    });

    const error = await Effect.runPromise(
      TagQueries.use(queries => queries.findById(TagId.make('nope'))).pipe(
        Effect.flip,
        Effect.provide(TagQueriesLocal.pipe(Layer.provide(repo))),
      ),
    );

    expect(error).toBeInstanceOf(TagNotFound);
  });
});
