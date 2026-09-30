import { Option, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { Portion, PortionJson, PortionKind } from './portion.model';

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
});
