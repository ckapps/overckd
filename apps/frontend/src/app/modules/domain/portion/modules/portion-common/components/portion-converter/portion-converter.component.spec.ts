import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PortionKind, PortionQuantifier } from '@overckd/domain';
import { PortionConverterService } from '../../services/portion-converter.service';
import { PortionConverterComponent } from './portion-converter.component';

describe('PortionConverterComponent', () => {
  let spectator: Spectator<PortionConverterComponent>;
  const createComponent = createComponentFactory({
    component: PortionConverterComponent,
    mocks: [PortionConverterService],
  });

  const source: PortionQuantifier = {
    kind: PortionKind.Label,
    label: 'mock-label',
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        source,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
