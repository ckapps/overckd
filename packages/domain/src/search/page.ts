export interface BasePage {
  /**
   * Number of the current page, starting at 0
   */
  page: number;
  /**
   * Size of the requested page.
   */
  size: number;
}

export interface PagingInformation extends BasePage {
  /**
   * Number of items
   */
  count: number;
  /**
   * Link for requesting next page
   */
  next?: string;
  /**
   * Link for requesting previous page
   */
  prev?: string;
}

/**
 * Represents a page of data
 */
export interface Page<T> extends PagingInformation {
  /**
   * The result data
   */
  result: T[];
}
