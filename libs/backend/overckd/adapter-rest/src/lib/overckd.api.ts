import { RecipeCollectionApi } from '@_backend/recipe-collection/adapter-rest';
import { HttpApi, OpenApi } from '@effect/platform';

export class OverckdApi extends HttpApi.make('Overckd API')

  // .add(AccountsApi)
  // .add(GroupsApi)
  .add(RecipeCollectionApi)
  .prefix('/api')
  .annotate(OpenApi.Title, 'Overckd API') {}
