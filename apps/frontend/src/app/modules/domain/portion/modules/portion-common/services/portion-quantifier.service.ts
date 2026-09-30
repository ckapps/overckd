import { Injectable } from '@angular/core';

import { PortionKind, PortionQuantifier } from '@overckd/domain';

const defaultOrder: PortionKind[] = [
  PortionKind.Label,
  PortionKind.Quantity,
  PortionKind.Springform,
];

/**
 * Services for working with portion quantifiers
 */
@Injectable({ providedIn: 'root' })
export class PortionQuantifierService {
  public getAllKinds(): PortionKind[] {
    return defaultOrder;
  }
}
