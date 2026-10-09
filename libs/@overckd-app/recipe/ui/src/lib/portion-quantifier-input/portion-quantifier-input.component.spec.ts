import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PortionQuantifierInputComponent } from './portion-quantifier-input.component';

describe('PortionQuantifierInputComponent', () => {
  let fixture: ComponentFixture<PortionQuantifierInputComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideNoopAnimations()] });
    fixture = TestBed.createComponent(PortionQuantifierInputComponent);
    await fixture.whenStable();
  });

  it('starts with a quantity and its label', () => {
    const labels = [...fixture.nativeElement.querySelectorAll('mat-label')].map(
      (label: HTMLElement) => label.textContent?.trim(),
    );

    expect(fixture.componentInstance.kind).toBe('quantity');
    expect(labels).toEqual(['Kind', 'Quantity', 'Label']);
  });
});
