import { Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { recipeImageUrl } from './recipe-images.transform';

const mediaUrl = 'http://localhost:3000/images';

describe('recipeImageUrl', () => {
  it('turns an image of the media into its URL', () => {
    expect(recipeImageUrl(mediaUrl)('/images/recipe-1-1.jpeg')).toEqual(
      Option.some('http://localhost:3000/images/recipe-1-1.jpeg'),
    );
  });

  it('encodes the name', () => {
    expect(recipeImageUrl(mediaUrl)('/images/apple pie:1.jpeg')).toEqual(
      Option.some('http://localhost:3000/images/apple%20pie%3A1.jpeg'),
    );
  });

  it('has no URL for an image of the media without a media URL', () => {
    expect(recipeImageUrl(undefined)('/images/recipe-1-1.jpeg')).toEqual(
      Option.none(),
    );
  });

  it.each([
    'https://example.com/images/pancakes.jpeg',
    '/images/',
    'images/recipe-1-1.jpeg',
  ])('keeps %j as it is', image => {
    expect(recipeImageUrl(mediaUrl)(image)).toEqual(Option.some(image));
    expect(recipeImageUrl(undefined)(image)).toEqual(Option.some(image));
  });
});
