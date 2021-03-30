import { Logger } from './log';
import { prefixLogSuffix } from './prefix-log-suffix';

/**
 * @param logger
 * @param filename
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
