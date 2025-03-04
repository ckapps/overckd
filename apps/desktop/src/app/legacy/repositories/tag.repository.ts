import { Context, createReader, useContext } from '@marblejs/core';
import { TagRepository } from '@overckd/domain';
import { Reader } from 'fp-ts/lib/Reader';
import {
  combineLatest,
  first,
  from,
  map,
  mergeMap,
  of,
  pluck,
  switchMap,
} from 'rxjs';
import { TagDbCollectionToken } from '../db/collections/db.collections.tokens';
import { pluckData, pluckDataStrict, pluckManyData } from '../db/rxjs';
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
    const findByQuery: TagRepository['findByQuery'] = query => {
      logger.silly(`findByQuery`, query);

      let filterQuery = tagDB.find();

      if (query.query.label) {
        filterQuery = filterQuery
          .where('label')
          .regex(new RegExp(`${query.query.label}`, 'ig'));
      }

      // Apply paging
      const { page = 0, size = 30 } = query;
      const pagedQuery = filterQuery.limit(size).skip(page * size);

      return combineLatest([
        filterQuery.$.pipe(pluck('length')),
        pagedQuery.$,
      ]).pipe(
        first(),
        switchMap(([count, paged]) =>
          of(paged).pipe(
            pluckManyData(),
            map(result => {
              return {
                count,
                page,
                result,
                size,
              };
            }),
          ),
        ),
      );
    };

    const getByUri: TagRepository['getByUri'] = uri =>
      findOneByUriQuery.eq(uri).$.pipe(pluckData(), first());

    // ================================================================================
    // Commands
    let insertId = 1;
    const add: TagRepository['add'] = tag =>
      of(tag).pipe(
        map(({ uri, ...tag }) => ({
          ...tag,
          uri: `localhost/t/${++insertId}`,
        })),
        mergeMap(t => tagDB.upsert(t)),
        pluckDataStrict(),
      );

    const removeByUri: TagRepository['removeByUri'] = uri =>
      findOneByUriQuery.eq(uri).$.pipe(
        switchMap(doc => {
          if (!doc) {
            // TODO(db): Make an error class
            throw new Error('not found');
          }
          return from(doc.remove());
        }),
      );

    return {
      findByQuery,
      getByUri,
      add,
      removeByUri,
      update: (r, name) => {
        throw new Error('Method not implemented.');
      },
    };
  },
);
