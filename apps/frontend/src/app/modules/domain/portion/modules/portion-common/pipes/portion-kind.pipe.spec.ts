import { Portion } from '@overckd/domain-experimental';
import { PortionKindPipe } from './portion-kind.pipe';

describe('PortionKindPipe', () => {
  it('names every kind of portion', () => {
    const pipe = new PortionKindPipe();

    expect(Portion.kinds.map(kind => pipe.transform(kind))).toEqual([
      'by quantity',
      'Springform',
    ]);
  });
});
