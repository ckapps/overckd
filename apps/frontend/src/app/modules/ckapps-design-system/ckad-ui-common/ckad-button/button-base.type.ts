import { Signal } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

export interface CkadButtonBase {
  /**
   * Color scheme to use for this button
   */
  color: Signal<ThemePalette>;

  /**
   * Disabled if `true`
   */
  disabled: Signal<boolean>;
}
