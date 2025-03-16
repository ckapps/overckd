import { Tag, TagId } from '@overckd/domain-experimental';
import { Effect, Option } from 'effect';
import { describe, it, vi } from 'vitest';
import { TagRepo } from './tag.repostitory';
import * as UseCase from './tag.use-case';

describe('Tag/use-case', () => {
  const recipeCollection = Tag.make({
    uri: TagId.make('id'),
    label: 'name',
    icon: Option.none(),
  });

  describe('getfindByIdAll', () => {
    const repo: any = {
      findById: vi.fn(() => Effect.succeed([recipeCollection])),
    };

    it('should return all from repo', () => {
      const uri = recipeCollection.uri;
      const result = Effect.runSync(
        UseCase.findById(uri).pipe(Effect.provideService(TagRepo, repo)),
      );
      expect(result).toEqual([recipeCollection]);
    });
  });
});
