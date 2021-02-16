import { TimeUnit } from './units';

export type TimerId = string;

export interface RecipeTimer {
  /**
   * ID of the timer
   */
  //   id: TimerId;
  /**
   * Duration for the timer in `ms`
   */
  duration: number;
  /**
   * Preferred unit for displaying
   */
  units?: TimeUnit;
}
