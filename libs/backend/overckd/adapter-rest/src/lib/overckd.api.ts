import { CollectionApi } from '@_backend/collection/adapter-rest';
import { HttpApi, OpenApi } from '@effect/platform';

export class OverckdApi extends HttpApi.make('Overckd API')
  .add(CollectionApi)
  // prefix all endpoints with /api
  .prefix('/api')
  .annotate(OpenApi.Title, 'Overckd API') {}
