import { Pipe, PipeTransform } from '@angular/core';
import { PortionKind } from '@overckd/domain';

@Pipe({
  name: 'portionKind',
})
export class PortionKindPipe implements PipeTransform {
  private readonly mapping: { [P in PortionKind]: string } = {
    [PortionKind.Label]: 'by label',
    [PortionKind.Quantity]: 'by quantity',
    [PortionKind.Springform]: 'Springform',
  };

  transform(value: PortionKind, ...args: unknown[]): string {
    const label = this.mapping[value];

    return label;
  }
}
