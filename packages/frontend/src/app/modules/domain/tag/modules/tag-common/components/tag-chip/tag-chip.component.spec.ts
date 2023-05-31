import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { IconsModule } from 'src/app/modules/ui/icons/icons.module';
import { TagChipComponent } from './tag-chip.component';

describe('TagChipComponent', () => {
  let component: TagChipComponent;
  let fixture: ComponentFixture<TagChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagChipComponent],
      imports: [MatChipsModule, IconsModule],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
