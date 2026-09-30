import { CollectionApi } from '@overckd/collection/api-http';
import { RecipeApi } from '@overckd/recipe/api-http';
import { HttpApi, OpenApi } from 'effect/http-api';

export class OverckdApi extends HttpApi.make('Overckd API')
  .add(CollectionApi)
  .add(RecipeApi)
  // prefix all endpoints with /api
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'Overckd API' })) {}
