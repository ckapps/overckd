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

const withImagesFile = pancakesFile.replace(
  'images: []',
  'images:\n    - /images/pancakes.jpeg\n    - https://example.com/waffles.jpeg',
);

const mediaUrl = 'http://localhost:3000/images';

/** Reads `file` from a file system in which it has the text `text`, if any */
const read = (
  text?: string,
  options: { readonly mediaUrl?: string } = { mediaUrl },
) =>
  readRecipeFile({
    path: file,
    codec: 'yaml',
    mediaUrl: options.mediaUrl,
  }).pipe(
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

  it('should link the images of the media under the media URL', async () => {
    const recipe = await Effect.runPromise(read(withImagesFile));

    expect(recipe.images).toEqual([
      'http://localhost:3000/images/pancakes.jpeg',
      'https://example.com/waffles.jpeg',
    ]);
  });

  it('should leave out the images of the media without a media URL', async () => {
    const recipe = await Effect.runPromise(read(withImagesFile, {}));

    expect(recipe.images).toEqual(['https://example.com/waffles.jpeg']);
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
