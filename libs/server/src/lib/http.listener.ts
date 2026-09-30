import { httpListener } from '@marblejs/http';
import { bodyParser$ } from '@marblejs/middleware-body';
import { logger$ } from '@marblejs/middleware-logger';
import { routes$ } from './route';

export const listener = httpListener({
  middlewares: [logger$(), bodyParser$()],
  effects: [routes$],
});
