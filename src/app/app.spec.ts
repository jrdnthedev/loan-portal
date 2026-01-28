import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the wrapper div', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const wrapper = compiled.querySelector('#wrapper');
    expect(wrapper).toBeTruthy();
  });

  it('should render header with navigation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header');
    const nav = compiled.querySelector('app-nav');
    expect(header).toBeTruthy();
    expect(nav).toBeTruthy();
  });

  it('should render main content area', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const main = compiled.querySelector('main.main');
    expect(main).toBeTruthy();
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should render footer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  it('should have correct DOM structure', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Verify the structure: wrapper > header, main, footer
    const wrapper = compiled.querySelector('#wrapper');
    expect(wrapper?.children.length).toBe(3);
    expect(wrapper?.children[0].tagName.toLowerCase()).toBe('header');
    expect(wrapper?.children[1].tagName.toLowerCase()).toBe('main');
    expect(wrapper?.children[2].tagName.toLowerCase()).toBe('footer');
  });
});
