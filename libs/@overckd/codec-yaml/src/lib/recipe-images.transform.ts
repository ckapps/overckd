import { RecipePreparation } from '@overckd/domain-experimental';
import { Array, Option } from 'effect';

/** How a recipe file links an image of the server's media: `/images/<name>` */
const mediaPrefix = '/images/';

/**
 * The URL of an image of a recipe file. `/images/<name>` is the medium
 * `<name>`, at `<mediaUrl>/<name>`, and has none without a `mediaUrl`.
 * Anything else is the URL of another site and stays as it is.
 *
 * @param mediaUrl Where the server's media are, such as
 * `http://localhost:3000/images`; without a trailing `/`
 */
export const recipeImageUrl =
  (mediaUrl: string | undefined) =>
  (image: string): Option.Option<string> => {
    const name = image.startsWith(mediaPrefix)
      ? image.slice(mediaPrefix.length)
      : '';
    if (name === '') {
      return Option.some(image);
    }
    return mediaUrl === undefined
      ? Option.none()
      : Option.some(`${mediaUrl}/${encodeURIComponent(name)}`);
  };

/**
 * `recipe` with the images of its file turned into URLs (see
 * `recipeImageUrl`).
 */
export const withRecipeImageUrls =
  (mediaUrl: string | undefined) =>
  (recipe: RecipePreparation): RecipePreparation => ({
    ...recipe,
    images: Array.flatMap(
      recipe.images,
      Array.liftOption(recipeImageUrl(mediaUrl)),
    ),
  });
