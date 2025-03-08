import { act, matchEvent, useContext } from '@marblejs/core';
import { MsgEffect, reply } from '@marblejs/messaging';
import { eventValidator$ } from '@marblejs/middleware-io';
import { pipe } from 'effect/Function';
import { mergeMap } from 'rxjs';
import { RecipeCollectionRepositoryToken } from '../../tokens';
import { CreateRecipeCollectionCommand } from './recipe-collection.command';
import { RecipeCollectionCreatedEvent } from './recipe-collection.event';
import { createRecipeCollection } from './recipe-collection.model';

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
        mergeMap(collection => [
          // @ts-ignore
          RecipeCollectionCreatedEvent.create(collection),
          // @ts-ignore
          reply(event)(RecipeCollectionCreatedEvent.create(collection)),
        ]),
      ),
    ),
  );
};
