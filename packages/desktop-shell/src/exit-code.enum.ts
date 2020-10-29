/**
 * Enum describing the application exit codes
 */
export enum ExitCode {
  /** Everything was exited OK */
  Ok = 0,
  /** Failed on protocol registration */
  ProtocolRegistrationFailed = 1,
  /** Failed on server listening */
  ServerStartFailed = 2,
  /** The passed config file could not be parsed */
  ConfigFileInvalid = 3,
}
