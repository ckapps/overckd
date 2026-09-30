import * as t from 'io-ts';

export const serverConfig = t.partial({
  /**
   * Port on which the server should run
   */
  port: t.number,
  /**
   * Dictionary of paths
   */
  paths: t.partial({
    /**
     * Path to the images
     */
    images: t.string,
  }),
});

export type ServerConfigFile = t.TypeOf<typeof serverConfig>;
