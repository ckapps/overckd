import { ThemePalette } from '@angular/material/core';

export interface CkadButtonBase {
  /**
   * Color scheme to use for this button
   */
  color: ThemePalette;

  /**
   * Disabled if `true`
   */
  disabled: boolean;
}
