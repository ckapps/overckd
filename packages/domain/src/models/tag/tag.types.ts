export type BaseTagIcon = string;

export interface BaseTag {
  /**
   * tag URI
   */
  uri: string;
  /**
   * the tag label
   */
  label: string;
  /**
   * color for the tag.
   */
  color?: string;
  /**
   * Tag icon
   */
  icon?: BaseTagIcon;
}

/**
 * Represents a tag
 */
export type Tag = BaseTag;
