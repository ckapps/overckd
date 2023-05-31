import { Component, Input } from '@angular/core';
import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';
import { Tag } from '@overckd/domain';
import { ColorService } from 'src/app/modules/ckapps-design-system/ckad-core/services/color.service';

@Component({
  selector: 'overckd-tag-chip',
  templateUrl: './tag-chip.component.html',
  styleUrls: ['./tag-chip.component.scss'],
})
export class TagChipComponent {
  @Input() tag: Tag;

  constructor(private colorService: ColorService) {}

  public getChipClasses(tag: Tag) {
    const { color } = tag ?? {};
    const classes = [];

    if (color) {
      classes.push(
        `text-${this.colorService.isLightColor(color) ? 'dark' : 'light'}`,
      );
    }

    return classes.join(' ');
  }

  public getIcon(icon: string): IconProp {
    return icon as IconName;
  }
}
