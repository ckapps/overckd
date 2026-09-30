import { ContextProvider } from '@marblejs/core';
import { Context } from 'effect';

export class MarbleJsContextProvider extends Context.Service<
  MarbleJsContextProvider,
  ContextProvider
>()('MarbleJsContextProvider') {}
