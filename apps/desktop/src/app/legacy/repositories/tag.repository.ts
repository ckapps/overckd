import { Context, createReader, useContext } from '@marblejs/core';
import { TagRepository } from '@overckd/domain';
import { Reader } from 'fp-ts/lib/Reader';
import { first } from 'rxjs';
import { TagDbCollectionToken } from '../db/collections/db.collections.tokens';
import { pluckData } from '../db/rxjs';
import { RepositoryLogScope, scoped } from '../logging';

const logger = scoped(RepositoryLogScope.Ingredient);

export const TagFileRepository: Reader<Context, TagRepository> = createReader(
  ask => {
    const tagDB = useContext(TagDbCollectionToken)(ask);

    logger.silly(`setting up TagFileRepository`);

    // ================================================================================
    // Set up queries
    const findAllQuery = tagDB.find().$;
    const findOneByUriQuery = tagDB.findOne().where('uri');

    // ================================================================================
    // Logging
    // tagDB.insert$.subscribe(changeEvent => console.dir(changeEvent));
    // tagDB.update$.subscribe(changeEvent => console.dir(changeEvent));
    // tagDB.remove$.subscribe(changeEvent => console.dir(changeEvent));

    // ================================================================================
    // Queries

    const getByUri: TagRepository['getByUri'] = uri =>
      findOneByUriQuery.eq(uri).$.pipe(pluckData(), first());

    // ================================================================================
    // Commands

    return {
      getByUri,
    };
  },
);
