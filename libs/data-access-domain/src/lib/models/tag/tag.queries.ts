import { DataQuery } from '../../search';

export interface TagSearch {
  /**
   * Tag label
   */
  label?: string;
}

export type TagQuery = DataQuery<TagSearch>;
