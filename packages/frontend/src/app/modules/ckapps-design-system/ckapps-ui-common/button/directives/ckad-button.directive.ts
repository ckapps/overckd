import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'button[ckad-button]',
})
export class CkadButtonDirective {
  constructor() {}

  @HostBinding('class.ckad-button') cssBaseClass = 'ckad-button';

  /**
   * Color scheme to use for this button
   */
  @Input() color: string;

  @HostBinding('ngClass')
  get classes() {
    return [this.color && `${this.cssBaseClass}--color-${this.color}`];
  }
}
