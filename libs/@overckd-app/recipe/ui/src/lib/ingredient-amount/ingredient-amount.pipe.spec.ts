import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CountIngredientAmount,
  FractionIngredientAmount,
  LabelIngredientAmount,
  UnitIngredientAmount,
} from '@overckd/domain-experimental';
import { IngredientAmountPipe } from './ingredient-amount.pipe';

describe('IngredientAmountPipe', () => {
  let pipe: IngredientAmountPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    });
    pipe = TestBed.runInInjectionContext(() => new IngredientAmountPipe());
  });

  it('shows a label as it is', () => {
    expect(pipe.transform(LabelIngredientAmount.make({ label: '1-2' }))).toBe(
      '1-2',
    );
  });

  it('shows a count', () => {
    expect(
      pipe.transform(CountIngredientAmount.make({ count: 4, scaleFactor: 1 })),
    ).toBe('4');
  });

  it('shows quarters as fraction symbols', () => {
    const fraction = (value: number) =>
      pipe.transform(FractionIngredientAmount.make({ value, scaleFactor: 1 }));

    expect(fraction(0.25)).toBe('¼');
    expect(fraction(0.5)).toBe('½');
    expect(fraction(1.75)).toBe('1¾');
  });

  it('shows the value of a unit amount, with at most two decimals', () => {
    const grams = (value: number) =>
      pipe.transform(
        UnitIngredientAmount.make({ unit: 'g', value, scaleFactor: 1 }),
      );

    expect(grams(162.501)).toBe('162½');
    expect(grams(1.333)).toBe('1.33');
  });
});
