import { prefixLogSuffix } from '@overckd/domain/dist/logging/prefix-log-suffix';

import { Logger } from './log';

/**
 * @param logger The logger used for logging
 * @param filename Filename
 *
 * @returns
 * A logger that prepends the filename on every message
 */
export function createFileLogger(logger: Logger, filename: string): Logger {
  const cwd = process.cwd();

  // Shorten the filepath, if in cwd
  const filePath = filename.startsWith(cwd)
    ? `.${filename.substr(cwd.length)}`
    : filename;

  return prefixLogSuffix(logger, [filePath]);
}
