import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { HttpError, HttpStatus, r, useContext } from '@marblejs/core';
import { from, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { requestValidator$, t } from '@marblejs/middleware-io';

import { ServerConfigToken } from '../../tokens';

const fileExists = promisify(fs.stat);

const validateRequest = requestValidator$({
  params: t.type({ dir: t.string }),
});

/**
 * `GET` image using the filepath
 */
export const getImages$ = r.pipe(
  r.matchPath('/images/:dir*'),
  r.matchType('GET'),
  r.useEffect((req$, ctx) => {
    const serverConfig = useContext(ServerConfigToken)(ctx.ask);

    const { images: imagePath } = serverConfig.paths;

    // If the image path is not set up, we won't serve images
    if (!imagePath) {
      return req$.pipe(
        mergeMap(() =>
          throwError(new HttpError('Route not found', HttpStatus.NOT_FOUND)),
        ),
      );
    }

    const basePath = path.resolve(process.cwd(), imagePath);

    return req$.pipe(
      validateRequest,
      map(req => req.params.dir),
      map(dir => path.resolve(basePath, dir)),
      mergeMap(dir =>
        !dir
          ? throwError('No file provided')
          : from(fileExists(dir)).pipe(
              mergeMap(x =>
                x.isFile() ? of(dir) : throwError('File does not exist'),
              ),
            ),
      ),
      map(dir => fs.createReadStream(dir)),
      map(body => ({ body })),
      catchError(error =>
        throwError(new HttpError('Route not found', HttpStatus.NOT_FOUND)),
      ),
    );
  }),
);
