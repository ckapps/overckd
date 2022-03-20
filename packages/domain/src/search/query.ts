import { BasePage } from './page';

export interface DataQuery<T> extends Partial<BasePage> {
  /**
   * query information
   */
  query: T;
}
