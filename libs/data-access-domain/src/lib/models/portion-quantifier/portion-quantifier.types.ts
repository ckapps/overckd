/**
 * Describes the kind of the portion
 */
export enum PortionKind {
  Label = 'label',
  Quantity = 'quantity',
  Springform = 'springform',
}

export interface IPortionQuantifier {
  /**
   * The kind of the quantifier
   */
  kind: PortionKind;
}

export type PortionQuantifier =
  | LabelPortionQuantifier
  | QuantityPortionQuantifier
  | SpringformPortionQuantifier;

export interface LabelPortionQuantifier extends IPortionQuantifier {
  kind: PortionKind.Label;
  label: string;
}

export interface QuantityPortionQuantifier extends IPortionQuantifier {
  kind: PortionKind.Quantity;
  count: number;
  label?: string;
}

export interface SpringformPortionQuantifier extends IPortionQuantifier {
  kind: PortionKind.Springform;
  /**
   * The diameter in centimeter
   */
  diameter: number;
}
