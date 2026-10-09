import { injectQueries } from '@ckapp/angular-effect';
import { CollectionQueries } from '@overckd/collection/application';

/** The collection queries as Angular resources. Call in an injection context. */
export const injectCollectionQueries = () => injectQueries(CollectionQueries);
