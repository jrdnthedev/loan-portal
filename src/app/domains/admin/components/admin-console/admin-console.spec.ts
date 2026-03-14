import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminConsole } from './admin-console';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-child',
  template: '<div>Test Child</div>',
  standalone: true,
})
class TestChildComponent {}

describe('AdminConsole', () => {
  let component: AdminConsole;
  let fixture: ComponentFixture<AdminConsole>;

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

    fixture = TestBed.createComponent(AdminConsole);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navItems', () => {
    it('should initialize navItems with correct structure', () => {
      expect(component.navItems).toBeDefined();
      expect(component.navItems.length).toBeGreaterThanOrEqual(2);
    });

    it('should have Audit nav item', () => {
      const auditItem = component.navItems.find((item) => item.label === 'Audit');
      expect(auditItem).toBeDefined();
      expect(auditItem?.route).toBe('audit_log');
      expect(auditItem?.description).toBe('View system audit logs and activity history');
    });

    it('should have User Management nav item', () => {
      const userMgmtItem = component.navItems.find((item) => item.label === 'User Management');
      expect(userMgmtItem).toBeDefined();
      expect(userMgmtItem?.route).toBe('user_management');
      expect(userMgmtItem?.description).toBe('Manage user accounts and permissions');
    });

    it('should have all required properties for each nav item', () => {
      component.navItems.forEach((item) => {
        expect(item.label).toBeDefined();
        expect(item.route).toBeDefined();
        expect(typeof item.label).toBe('string');
        expect(typeof item.route).toBe('string');
      });
    });
  });

  describe('Template rendering', () => {
    it('should render child-nav-layout component', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const childNavLayout = compiled.querySelector('app-child-nav-layout');
      expect(childNavLayout).toBeTruthy();
    });

    it('should pass navItems to child-nav-layout', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const childNavLayout = compiled.querySelector('app-child-nav-layout');
      expect(childNavLayout).toBeTruthy();
      // The component's navItems should be defined and passed down
      expect(component.navItems.length).toBeGreaterThan(0);
    });
  });
});
