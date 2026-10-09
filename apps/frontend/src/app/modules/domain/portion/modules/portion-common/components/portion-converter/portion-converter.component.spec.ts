import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { Portion } from '@overckd/domain-experimental';
import { Option } from 'effect';
import { PortionConverterComponent } from './portion-converter.component';

describe('PortionConverterComponent', () => {
  let spectator: Spectator<PortionConverterComponent>;
  const createComponent = createComponentFactory({
    component: PortionConverterComponent,
    detectChanges: false,
  });

  const twoServings: Portion.Portion = {
    kind: 'quantity',
    label: Option.some('servings'),
    quantity: 2,
  };

  const create = async (source: Portion.Portion) => {
    spectator = createComponent({ props: { source } });
    const scaleFactors: Array<number> = [];
    spectator.output('scaleFactorChanged').subscribe(factor => {
      scaleFactors.push(factor);
    });
    await spectator.fixture.whenStable();
    return scaleFactors;
  };

  const enter = async (value: string) => {
    spectator.typeInElement(value, 'input');
    await spectator.fixture.whenStable();
  };

  it('starts with the quantity of the portion and its label', async () => {
    const scaleFactors = await create(twoServings);

    expect(spectator.query('input')).toHaveValue('2');
    expect(spectator.element).toHaveText('servings');
    expect(scaleFactors).toEqual([1]);
  });

  it('emits the scale factor to reach the entered quantity', async () => {
    const scaleFactors = await create(twoServings);

    await enter('5');

    expect(scaleFactors).toEqual([1, 2.5]);
  });

  it('keeps the scale factor for a quantity that is not positive', async () => {
    const scaleFactors = await create(twoServings);

    await enter('0');
    await enter('');

    expect(scaleFactors).toEqual([1]);
  });

  it('shows the diameter of a springform', async () => {
    await create({ kind: 'springform', diameter: 26 });

    expect(spectator.query('input')).toBeNull();
    expect(spectator.element).toHaveText('26');
  });
});
