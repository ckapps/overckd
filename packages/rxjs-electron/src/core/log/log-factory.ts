import {
  Logger,
  LogLevel,
  prefixLogSuffix,
} from '@ckapp/rxjs-snafu/lib/cjs/log';

type LogFactory = (scope: string) => Logger;

function consoleLogger(): Logger {
  return {
    [LogLevel.Debug]: (...args) => console.debug(...args),
    [LogLevel.Error]: (...args) => console.error(...args),
    [LogLevel.Info]: (...args) => console.info(...args),
    log: (...args) => console.log(...args),
    [LogLevel.Silly]: (...args) => console.log(...args),
    [LogLevel.Verbose]: (...args) => console.log(...args),
    [LogLevel.Warning]: (...args) => console.warn(...args),
  };
}

let factory: LogFactory = scope => {
  return prefixLogSuffix(consoleLogger(), [scope]);
};

export function setFactory(f: LogFactory): void {
  factory = f;
}

export function logFactory(scope: string) {
  return factory(scope);
}
