import { BaseEncodingOptions, PathLike } from 'fs';

import { OperatorFunction } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { readFile as _readFile } from '../../fs';

type Input = PathLike | number;

export function readFile(
  options?: { encoding?: null; flag?: string } | null,
): OperatorFunction<Input, Buffer>;

export function readFile(
  options: { encoding: BufferEncoding; flag?: string } | string,
): OperatorFunction<Input, string>;

/**
 * Operator to read the file
 *
 * @param options The options for reading the file
 */
export function readFile(
  options?: (BaseEncodingOptions & { flag?: string }) | string | null,
): OperatorFunction<Input, Buffer | string> {
  return mergeMap(filepath => _readFile(filepath, options));
}
