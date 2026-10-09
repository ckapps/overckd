import { protocol } from 'electron';

/** The scheme of the API: the renderer calls `overckd://app/api/…` */
export const apiScheme = 'overckd';

/** The scheme of the packaged renderer: the window loads `overckd-app://app/` */
export const rendererScheme = 'overckd-app';

/**
 * Registers the schemes of the API and the renderer. Must run once, before the
 * app is ready.
 *
 * `standard` parses their URLs like http URLs (host `app`), `secure` makes
 * them secure contexts and `supportFetchAPI` allows `fetch`. The API's
 * `corsEnabled` allows the calls from the renderer's origin.
 */
export const registerSchemes = () =>
  protocol.registerSchemesAsPrivileged([
    {
      scheme: apiScheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
    {
      scheme: rendererScheme,
      privileges: { standard: true, secure: true, supportFetchAPI: true },
    },
  ]);
