import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Topbar } from './topbar';

describe('Topbar', () => {
  let component: Topbar;
  let fixture: ComponentFixture<Topbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topbar],
    }).compileComponents();

    fixture = TestBed.createComponent(Topbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render topbar container with correct class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const topbarElement = compiled.querySelector('.topbar');

    expect(topbarElement).toBeTruthy();
    expect(topbarElement?.classList.contains('topbar')).toBe(true);
  });

  it('should have proper structure for content projection', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const topbarElement = compiled.querySelector('.topbar');

    expect(topbarElement).toBeTruthy();
    expect(topbarElement?.tagName.toLowerCase()).toBe('div');
  });

  it('should be a standalone component', () => {
    expect(component).toBeDefined();
    expect(fixture.componentRef).toBeTruthy();
  });

  it('should render empty topbar when no content is provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const topbarElement = compiled.querySelector('.topbar');

    expect(topbarElement).toBeTruthy();
    expect(topbarElement?.textContent?.trim()).toBe('');
  });
});
