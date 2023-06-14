import { isString } from '../string';
import { isArrayOfType } from './is-array-of-type';

/**
 * Type guard for string arrays
 */
export const isStringArray = isArrayOfType(isString);
