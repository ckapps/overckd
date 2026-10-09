import { Pipe, PipeTransform } from '@angular/core';
import { Portion } from '@overckd/domain-experimental';

@Pipe({ name: 'portionKind' })
export class PortionKindPipe implements PipeTransform {
  private readonly mapping: { [P in Portion.PortionKind]: string } = {
    [Portion.PortionKind.Quantity]: 'by quantity',
    [Portion.PortionKind.Springform]: 'Springform',
  };

  transform(value: Portion.PortionKind): string {
    return this.mapping[value];
  }
}
