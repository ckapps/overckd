import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CkadInputFieldComponent } from './input-field.component';

describe('CkadInputFieldComponent', () => {
  let spectator: Spectator<CkadInputFieldComponent>;
  const createComponent = createComponentFactory({
    component: CkadInputFieldComponent,
    providers: [provideNoopAnimations()],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        type: 'text',
        label: 'Test',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
