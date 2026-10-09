import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffectRuntime } from '@ckapp/angular-effect';
import { CollectionQueries } from '@overckd/collection/application';
import { Collection, CollectionId } from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { AppMainMenuComponent } from './app-main-menu.component';

describe('AppMainMenuComponent', () => {
  let fixture: ComponentFixture<AppMainMenuComponent>;

  const desserts = Collection.make({
    id: CollectionId.make('desserts'),
    name: 'Desserts',
    description: '',
    recipes: [],
  });

  const create = async (getAll: CollectionQueries['Service']['getAll']) => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideEffectRuntime(Layer.mock(CollectionQueries, { getAll })),
      ],
    });
    fixture = TestBed.createComponent(AppMainMenuComponent);
    await fixture.whenStable();
  };

  it('links the collections', async () => {
    await create(Effect.succeed([desserts]));

    const link = fixture.nativeElement.querySelector(
      'a[href="/collections/collection/desserts"]',
    );
    expect(link?.textContent).toContain('Desserts');
  });

  it('shows the menu when the collections cannot be loaded', async () => {
    await create(Effect.die(new Error('offline')));

    expect(fixture.nativeElement.textContent).toContain('Print template');
  });
});
