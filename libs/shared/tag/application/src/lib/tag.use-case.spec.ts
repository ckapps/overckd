import { Tag, TagId } from '@overckd/domain-experimental';
import { Effect, Option } from 'effect';
import { describe, it, vi } from 'vitest';
import { TagRepo } from './tag.repostitory';
import { TagUseCase } from './tag.use-case';

describe('Tag/use-case', () => {
  const tag = Tag.make({
    uri: TagId.make('id'),
    label: 'name',
    icon: Option.none(),
  });

  describe('findById', () => {
    const repo: any = {
      findById: vi.fn(() => Effect.succeed([tag])),
    };

    const findById = (id: TagId) =>
      Effect.gen(function* () {
        const uc = yield* TagUseCase;
        return yield* uc.findById(id);
      });

    it('should return all from repo', () => {
      const result = Effect.runSync(
        findById(tag.uri).pipe(
          Effect.provide(TagUseCase.Default),
          Effect.provideService(TagRepo, repo),
        ),
      );
      expect(result).toEqual([tag]);
    });
  });
});
