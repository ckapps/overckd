import { Option, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import {
  getQuantity,
  kinds,
  Portion,
  PortionJson,
  PortionKind,
  scaleFactor,
  scaleFactorTo,
  withQuantity,
} from './portion.model';

describe('Portion', () => {
  const decode = Schema.decodeSync(Portion);
  const decodeJson = Schema.decodeSync(PortionJson);

  describe('QuantityPortion', () => {
    it('should decode', () => {
      const portion = decode({
        kind: PortionKind.Quantity,
        label: Option.none(),
        quantity: 1,
      });

      expect(portion).toBeDefined();
    });
    it('should decode from JSON', () => {
      const portion = decodeJson({
        kind: 'quantity',
        quantity: 1,
      });

      expect(portion).toBeDefined();
    });
  });

  describe('SpringformPortion', () => {
    it('should decode', () => {
      const portion = decode({
        kind: PortionKind.Springform,
        diameter: 1,
      });

      expect(portion).toBeDefined();
    });
    it('should decode from JSON', () => {
      const portion = decodeJson({
        kind: 'springform',
        diameter: 1,
      });

      expect(portion).toBeDefined();
    });
  });

  const fourServings: Portion = {
    kind: PortionKind.Quantity,
    label: Option.some('servings'),
    quantity: 4,
  };
  const springform: Portion = { kind: PortionKind.Springform, diameter: 24 };

  it('offers the quantity before the springform', () => {
    expect(kinds).toEqual([PortionKind.Quantity, PortionKind.Springform]);
  });

  describe('getQuantity', () => {
    it('is the quantity, or the diameter of a springform', () => {
      expect(getQuantity(fourServings)).toBe(4);
      expect(getQuantity(springform)).toBe(24);
    });
  });

  describe('withQuantity', () => {
    it('replaces the quantity and keeps the label', () => {
      expect(withQuantity(fourServings, 6)).toEqual(
        Option.some({ ...fourServings, quantity: 6 }),
      );
    });

    it('replaces the diameter of a springform', () => {
      expect(withQuantity(springform, 26)).toEqual(
        Option.some({ ...springform, diameter: 26 }),
      );
    });

    it('is none for a quantity that is not positive', () => {
      expect(withQuantity(fourServings, 0)).toEqual(Option.none());
      expect(withQuantity(springform, -1)).toEqual(Option.none());
      expect(withQuantity(fourServings, Number.NaN)).toEqual(Option.none());
    });
  });

  describe('scaleFactor', () => {
    it('is the ratio of the target to the source quantity', () => {
      expect(scaleFactor(fourServings, { ...fourServings, quantity: 6 })).toBe(
        1.5,
      );
      expect(scaleFactor(springform, { ...springform, diameter: 12 })).toBe(
        0.5,
      );
    });
  });

  describe('scaleFactorTo', () => {
    it('is the factor to reach the given quantity', () => {
      expect(scaleFactorTo(fourServings, 2)).toEqual(Option.some(0.5));
      expect(scaleFactorTo(springform, 36)).toEqual(Option.some(1.5));
    });

    it('is none for a quantity that is not positive', () => {
      expect(scaleFactorTo(fourServings, 0)).toEqual(Option.none());
    });
  });
});
