import { Context, Effect, Layer, Path } from 'effect';

/** Where the files of an app directory are (see `data/example-1/app`). */
export class AppDirectory extends Context.Service<
  AppDirectory,
  {
    /** The directory of the `*.recipe.yaml` files */
    readonly recipes: string;
    /** `overckd.collections.yaml` */
    readonly collectionsFile: string;
    /** The directory of the recipe images */
    readonly images: string;
  }
>()('@overckd/desktop/AppDirectory') {
  /** The app directory at `root` */
  static readonly layer = (root: string) =>
    Layer.effect(
      AppDirectory,
      Effect.gen(function* () {
        const path = yield* Path.Path;
        return AppDirectory.of({
          recipes: path.join(root, 'recipes'),
          collectionsFile: path.join(root, 'overckd.collections.yaml'),
          images: path.join(root, 'images'),
        });
      }),
    );
}
