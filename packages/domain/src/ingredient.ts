export interface Ingredient {
  amount?: number | string;
  unit?: string;
  name: string;

  optional?: boolean;
  alternatives?: string[];
}
