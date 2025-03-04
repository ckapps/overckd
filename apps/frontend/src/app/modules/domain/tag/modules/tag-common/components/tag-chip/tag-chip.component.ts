import { NgStyle } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';
import { Tag } from '@overckd/domain';
import { ColorService } from '../../../../../../ckapps-design-system/ckad-core/services/color.service';

@Component({
  selector: 'overckd-tag-chip',
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.scss'],
  imports: [MatChip, NgStyle, FontAwesomeModule],
})
export class TagChipComponent {
  readonly #colorService = inject(ColorService);

  readonly tag = input.required<Tag>();

  public getChipClasses(tag: Tag) {
    const { color } = tag ?? {};
    const classes = [];

    if (color) {
      classes.push(
        `text-${this.#colorService.isLightColor(color) ? 'dark' : 'light'}`,
      );
    }

    return classes.join(' ');
  }

  public getIcon(icon: string): IconProp {
    return icon as IconName;
  }
}
