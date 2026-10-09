import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEffectRuntime } from '@ckapp/angular-effect';
import { CollectionQueries } from '@overckd/collection/application';
import {
  Collection,
  CollectionFindByIdPayload,
  CollectionId,
  CollectionNotFound,
} from '@overckd/domain';
import { Effect, Layer } from 'effect';
import { beforeEach, describe, expect, it } from 'vitest';
import { injectCollectionQueries } from './collection.bindings';

const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: '',
  recipes: [],
});

const findDesserts = ({ id }: CollectionFindByIdPayload) =>
  id === desserts.id
    ? Effect.succeed(desserts)
    : Effect.fail(new CollectionNotFound({ id }));

const stable = () => TestBed.inject(ApplicationRef).whenStable();

describe('injectCollectionQueries', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideEffectRuntime(
          Layer.mock(CollectionQueries, {
            getAll: Effect.succeed([desserts]),
            findById: findDesserts,
          }),
        ),
      ],
    });
  });

  it('loads all collections', async () => {
    const collections = TestBed.runInInjectionContext(() =>
      injectCollectionQueries().getAll(),
    );
    await stable();
    expect(collections.value()).toEqual([desserts]);
  });

  it('stays idle while an input is undefined, then loads', async () => {
    const payload = signal<CollectionFindByIdPayload | undefined>(undefined);
    const collection = TestBed.runInInjectionContext(() =>
      injectCollectionQueries().findById(payload),
    );
    await stable();
    expect(collection.status()).toBe('idle');

    payload.set({ id: desserts.id });
    await stable();
    expect(collection.value()?.name).toBe('Desserts');
  });

  it('shows CollectionNotFound as the resource error', async () => {
    const collection = TestBed.runInInjectionContext(() =>
      injectCollectionQueries().findById(
        signal({ id: CollectionId.make('nope') }),
      ),
    );
    await stable();
    expect(collection.status()).toBe('error');
    expect(collection.error()).toBeInstanceOf(CollectionNotFound);
  });
});
