import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RecipeInputSourcesListComponent } from './recipe-input-sources-list.component';

describe('RecipeInputSourcesListComponent', () => {
  let spectator: Spectator<RecipeInputSourcesListComponent>;
  const createComponent = createComponentFactory({
    component: RecipeInputSourcesListComponent,
    providers: [provideNoopAnimations()],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        label: 'Label',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
