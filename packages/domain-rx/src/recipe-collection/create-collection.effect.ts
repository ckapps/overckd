import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { act, useContext, matchEvent } from '@marblejs/core';
import { reply, MsgEffect } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';

import { createRecipeCollection } from './recipe-collection.model';
import { CreateRecipeCollectionCommand } from './recipe-collection.command';
import { RecipeCollectionCreatedEvent } from './recipe-collection.event';
import { RecipeCollectionRepositoryToken } from '../tokens';

/**
 * Event effect for creating recipe collection.
 *
 * @param event$ Event observable
 * @param ctx Event Context
 */
export const createCollection: MsgEffect = (event$, ctx) => {
  const repo = useContext(RecipeCollectionRepositoryToken)(ctx.ask);

  return event$.pipe(
    matchEvent(CreateRecipeCollectionCommand),
    act(eventValidator$(CreateRecipeCollectionCommand)),
    act(event =>
      pipe(
        event.payload,
        createRecipeCollection,
        repo.add,
        x => from(x),
        mergeMap(collection => [
          RecipeCollectionCreatedEvent.create(collection),
          reply(event)(RecipeCollectionCreatedEvent.create(collection)),
        ]),
      ),
    ),
  );
};
