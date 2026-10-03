import { Effect, FileSystem, PlatformError, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { readRecipeFile } from './recipe-file';

const file = '/app/recipes/pancakes.recipe.yaml';

const pancakesFile = `overckd: 1.0.0
recipe:
  name: Pancakes
  ingredients:
    - name: Flour
  steps:
    - Mix and fry
  tips: []
  images: []
  styles: {}
`;

/** Reads `file` from a file system in which it has the text `text`, if any */
const read = (text?: string) =>
  readRecipeFile(file, 'yaml').pipe(
    Effect.provideService(
      FileSystem.FileSystem,
      FileSystem.makeNoop({
        readFileString: path =>
          path === file && text !== undefined
            ? Effect.succeed(text)
            : Effect.fail(
                PlatformError.systemError({
                  _tag: 'NotFound',
                  module: 'FileSystem',
                  method: 'readFileString',
                  pathOrDescriptor: path,
                }),
              ),
      }),
    ),
  );

describe('readRecipeFile', () => {
  it('should read the recipe of the file', async () => {
    const recipe = await Effect.runPromise(read(pancakesFile));

    expect(recipe).toMatchObject({ id: 'Pancakes', name: 'Pancakes' });
  });

  it('should fail with a SchemaError on a broken file', async () => {
    const error = await Effect.runPromise(
      Effect.flip(read('overckd: 1.0.0\nrecipe: {}\n')),
    );

    expect(error).toBeInstanceOf(Schema.SchemaError);
  });

  it('should fail with a PlatformError without the file', async () => {
    const error = await Effect.runPromise(Effect.flip(read()));

    expect(error).toBeInstanceOf(PlatformError.PlatformError);
  });
});
