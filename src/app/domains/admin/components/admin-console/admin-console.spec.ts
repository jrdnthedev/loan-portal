import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminConsole } from './admin-console';
import { Component } from '@angular/core';
import { vi } from 'vitest';

@Component({
  selector: 'app-test-child',
  template: '<div>Test Child</div>',
  standalone: true,
})
class TestChildComponent {}

describe('AdminConsole', () => {
  let component: AdminConsole;
  let fixture: ComponentFixture<AdminConsole>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConsole],
      providers: [
        provideRouter([
          {
            path: 'admin/admin_console',
            component: AdminConsole,
            children: [
              { path: 'audit_log', component: TestChildComponent },
              { path: 'user_management', component: TestChildComponent },
            ],
          },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(AdminConsole);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showWelcome signal', () => {
    it('should initialize showWelcome as true', () => {
      expect(component.showWelcome()).toBe(true);
    });

    it('should set showWelcome to true when at /admin/admin_console route', async () => {
      await router.navigate(['/admin/admin_console']);
      fixture.detectChanges();

      expect(component.showWelcome()).toBe(true);
    });

    it('should set showWelcome to false when at child route', async () => {
      await router.navigate(['/admin/admin_console/audit_log']);
      fixture.detectChanges();

      expect(component.showWelcome()).toBe(false);
    });

    it('should set showWelcome to false when at user_management route', async () => {
      await router.navigate(['/admin/admin_console/user_management']);
      fixture.detectChanges();

      expect(component.showWelcome()).toBe(false);
    });

    it('should update showWelcome when navigating between routes', async () => {
      // Start at admin_console
      await router.navigate(['/admin/admin_console']);
      fixture.detectChanges();
      expect(component.showWelcome()).toBe(true);

      // Navigate to child route
      await router.navigate(['/admin/admin_console/audit_log']);
      fixture.detectChanges();
      expect(component.showWelcome()).toBe(false);

      // Navigate back to admin_console
      await router.navigate(['/admin/admin_console']);
      fixture.detectChanges();
      expect(component.showWelcome()).toBe(true);
    });
  });

  describe('Template rendering', () => {
    it('should render navigation menu', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('should render audit_log link', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a[routerLink]');
      const auditLink = Array.from(links).find(
        (link) => link.getAttribute('routerLink') === 'audit_log',
      );
      expect(auditLink).toBeTruthy();
      expect(auditLink?.textContent?.trim()).toBe('Audit');
    });

    it('should render user_management link', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a[routerLink]');
      const userMgmtLink = Array.from(links).find(
        (link) => link.getAttribute('routerLink') === 'user_management',
      );
      expect(userMgmtLink).toBeTruthy();
      expect(userMgmtLink?.textContent?.trim()).toBe('User Management');
    });

    it('should render welcome content when showWelcome is true', () => {
      // Initialize component first
      fixture.detectChanges();
      // Then set showWelcome and detect changes again
      component.showWelcome.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const welcomeDiv = compiled.querySelector('#admin_welcome');
      expect(welcomeDiv).toBeTruthy();
    });

    it('should render welcome heading', () => {
      // Initialize component first
      fixture.detectChanges();
      // Then set showWelcome and detect changes again
      component.showWelcome.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const heading = compiled.querySelector('#admin_welcome h2');
      expect(heading?.textContent).toBe('Admin Console');
    });

    it('should render admin options list', () => {
      // Initialize component first
      fixture.detectChanges();
      // Then set showWelcome and detect changes again
      component.showWelcome.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const optionsList = compiled.querySelector('#admin_options');
      expect(optionsList).toBeTruthy();

      const listItems = optionsList?.querySelectorAll('li');
      expect(listItems?.length).toBeGreaterThanOrEqual(2);
    });

    it('should render router-outlet when showWelcome is false', () => {
      // Initialize component first
      fixture.detectChanges();
      // Then set showWelcome and detect changes again
      component.showWelcome.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should not render welcome content when showWelcome is false', () => {
      // Initialize component first
      fixture.detectChanges();
      // Then set showWelcome and detect changes again
      component.showWelcome.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const welcomeDiv = compiled.querySelector('#admin_welcome');
      expect(welcomeDiv).toBeFalsy();
    });

    it('should render card component', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const card = compiled.querySelector('app-card');
      expect(card).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should check route state on initialization', () => {
      const checkRouteStateSpy = vi.spyOn(component as any, 'checkRouteState');
      component.ngOnInit();
      expect(checkRouteStateSpy).toHaveBeenCalled();
    });

    it('should subscribe to router events', () => {
      const subscribeSpy = vi.spyOn(router.events, 'pipe');
      component.ngOnInit();
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });
});
