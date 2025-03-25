import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CkadMainMenuGroupComponent } from './main-menu-group.component';

describe('MainMenuGroupComponent', () => {
  let spectator: Spectator<CkadMainMenuGroupComponent>;
  const createComponent = createComponentFactory(CkadMainMenuGroupComponent);

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          groupName: 'test',
          icon: faAddressBook,
        },
      })),
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
