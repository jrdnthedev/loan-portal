import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { Badge } from './badge';

@Component({
  standalone: true,
  imports: [Badge],
  template: `<app-badge>{{ content() }}</app-badge>`,
})
class HostComponent {
  content = signal('Test Badge');
}

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<Badge>;
  let component: Badge;
  let hostFixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge, HostComponent], // 👈 imports, not declarations
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
  });

  // --- Rendering ---

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a span with class "badge"', () => {
    const span = fixture.nativeElement.querySelector('span.badge');
    expect(span).not.toBeNull();
  });

  it('should only contain one span element', () => {
    const spans = fixture.nativeElement.querySelectorAll('span');
    expect(spans.length).toBe(1);
  });

  // --- Content Projection ---

  it('should render projected text content', () => {
    const span = hostFixture.nativeElement.querySelector('span.badge');
    expect(span.textContent.trim()).toBe('Test Badge');
  });

  it('should render projected HTML content', async () => {
    @Component({
      standalone: true,
      imports: [Badge],
      template: `<app-badge><strong>Bold</strong></app-badge>`,
    })
    class HtmlHost {}

    const htmlFixture = TestBed.createComponent(HtmlHost);
    htmlFixture.detectChanges();

    const strong = htmlFixture.nativeElement.querySelector('span.badge strong');
    expect(strong).not.toBeNull();
    expect(strong.textContent).toBe('Bold');
  });

  it('should render empty when no content is projected', () => {
    @Component({
      standalone: true,
      imports: [Badge],
      template: `<app-badge></app-badge>`,
    })
    class EmptyHost {}

    const emptyFixture = TestBed.createComponent(EmptyHost);
    emptyFixture.detectChanges();

    const span = emptyFixture.nativeElement.querySelector('span.badge');
    expect(span.textContent.trim()).toBe('');
  });

  it('should update projected content when host binding changes', async () => {
    const localFixture = TestBed.createComponent(HostComponent);
    localFixture.detectChanges();
    await localFixture.whenStable();

    const span = localFixture.nativeElement.querySelector('span.badge');
    expect(span.textContent.trim()).toBe('Test Badge');

    localFixture.componentInstance.content.set('Updated'); // 👈 .set() instead of assignment
    await localFixture.whenStable();

    expect(span.textContent.trim()).toBe('Updated');
  });

  // --- CSS Class ---

  it('should always have the "badge" class on the span', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('badge')).toBe(true);
  });
});
