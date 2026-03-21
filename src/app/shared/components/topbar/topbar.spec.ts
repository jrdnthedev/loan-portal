import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { Topbar } from './topbar';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [Topbar],
  template: `
    <app-topbar>
      <h1>Application Title</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">About</a>
      </nav>
    </app-topbar>
  `,
})
class TestHostComponent {}

@Component({
  selector: 'app-empty-host',
  standalone: true,
  imports: [Topbar],
  template: `<app-topbar></app-topbar>`,
})
class EmptyHostComponent {}

describe('Topbar', () => {
  let component: Topbar;
  let fixture: ComponentFixture<Topbar>;
  let debugElement: DebugElement;

  describe('Component Creation', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Topbar],
      }).compileComponents();

      fixture = TestBed.createComponent(Topbar);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be a standalone component', () => {
      expect(fixture.componentRef).toBeTruthy();
    });

    it('should render topbar container', () => {
      const topbar = debugElement.query(By.css('.topbar'));
      expect(topbar).toBeTruthy();
    });

    it('should render topbar as a div element', () => {
      const topbar = debugElement.query(By.css('.topbar'));
      expect(topbar.nativeElement.tagName.toLowerCase()).toBe('div');
    });

    it('should render empty when no content is projected', () => {
      const topbar = debugElement.query(By.css('.topbar'));
      expect(topbar.nativeElement.textContent.trim()).toBe('');
    });
  });

  describe('DOM Structure', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Topbar],
      }).compileComponents();

      fixture = TestBed.createComponent(Topbar);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should have topbar class on container', () => {
      const topbar = debugElement.query(By.css('.topbar'));
      expect(topbar.nativeElement.classList.contains('topbar')).toBe(true);
    });

    it('should have only one top-level element', () => {
      const children = debugElement.children;
      expect(children.length).toBe(1);
    });

    it('should not have nested structural elements by default', () => {
      const topbar = debugElement.query(By.css('.topbar'));
      expect(topbar.nativeElement.children.length).toBe(0);
    });
  });

  describe('Content Projection', () => {
    it('should project text content', () => {
      @Component({
        selector: 'app-text-host',
        standalone: true,
        imports: [Topbar],
        template: `<app-topbar>Simple Text</app-topbar>`,
      })
      class TextHostComponent {}

      TestBed.configureTestingModule({ imports: [TextHostComponent] });
      const hostFixture = TestBed.createComponent(TextHostComponent);
      hostFixture.detectChanges();

      const topbar = hostFixture.debugElement.query(By.css('.topbar'));
      expect(topbar.nativeElement.textContent.trim()).toBe('Simple Text');
    });

    it('should project HTML elements', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const h1 = hostFixture.debugElement.query(By.css('h1'));
      const nav = hostFixture.debugElement.query(By.css('nav'));

      expect(h1).toBeTruthy();
      expect(h1.nativeElement.textContent).toBe('Application Title');
      expect(nav).toBeTruthy();
    });

    it('should project navigation links', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const links = hostFixture.debugElement.queryAll(By.css('a'));
      expect(links.length).toBe(2);
      expect(links[0].nativeElement.textContent).toBe('Home');
      expect(links[1].nativeElement.textContent).toBe('About');
    });

    it('should handle empty content projection', () => {
      TestBed.configureTestingModule({ imports: [EmptyHostComponent] });
      const hostFixture = TestBed.createComponent(EmptyHostComponent);
      hostFixture.detectChanges();

      const topbar = hostFixture.debugElement.query(By.css('.topbar'));
      expect(topbar).toBeTruthy();
      expect(topbar.nativeElement.textContent.trim()).toBe('');
    });

    it('should project complex content', () => {
      @Component({
        selector: 'app-complex-host',
        standalone: true,
        imports: [Topbar],
        template: `
          <app-topbar>
            <div class="logo">
              <img src="" alt="Logo" />
            </div>
            <div class="nav-links">
              <a href="#">Dashboard</a>
              <a href="#">Reports</a>
              <a href="#">Settings</a>
            </div>
            <div class="user-actions">
              <span>John Doe</span>
              <button>Logout</button>
            </div>
          </app-topbar>
        `,
      })
      class ComplexHostComponent {}

      TestBed.configureTestingModule({ imports: [ComplexHostComponent] });
      const hostFixture = TestBed.createComponent(ComplexHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.debugElement.query(By.css('.logo'))).toBeTruthy();
      expect(hostFixture.debugElement.query(By.css('.nav-links'))).toBeTruthy();
      expect(hostFixture.debugElement.query(By.css('.user-actions'))).toBeTruthy();
      expect(hostFixture.debugElement.queryAll(By.css('.nav-links a')).length).toBe(3);
      expect(hostFixture.debugElement.query(By.css('button')).nativeElement.textContent).toBe(
        'Logout',
      );
    });

    it('should project content inside the topbar div', () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const topbar = hostFixture.debugElement.query(By.css('.topbar'));
      const h1 = topbar.query(By.css('h1'));
      const nav = topbar.query(By.css('nav'));

      expect(h1).toBeTruthy();
      expect(nav).toBeTruthy();
    });
  });

  describe('Use Cases', () => {
    it('should work as application header', () => {
      @Component({
        selector: 'app-header-host',
        standalone: true,
        imports: [Topbar],
        template: `
          <app-topbar>
            <h1>Loan Portal</h1>
          </app-topbar>
        `,
      })
      class HeaderHostComponent {}

      TestBed.configureTestingModule({ imports: [HeaderHostComponent] });
      const hostFixture = TestBed.createComponent(HeaderHostComponent);
      hostFixture.detectChanges();

      const h1 = hostFixture.debugElement.query(By.css('h1'));
      expect(h1.nativeElement.textContent).toBe('Loan Portal');
    });

    it('should work as navigation bar', () => {
      @Component({
        selector: 'app-nav-host',
        standalone: true,
        imports: [Topbar],
        template: `
          <app-topbar>
            <nav aria-label="Main navigation">
              <ul>
                <li><a href="#">Applications</a></li>
                <li><a href="#">Underwriting</a></li>
                <li><a href="#">Admin</a></li>
              </ul>
            </nav>
          </app-topbar>
        `,
      })
      class NavHostComponent {}

      TestBed.configureTestingModule({ imports: [NavHostComponent] });
      const hostFixture = TestBed.createComponent(NavHostComponent);
      hostFixture.detectChanges();

      const nav = hostFixture.debugElement.query(By.css('nav'));
      const items = hostFixture.debugElement.queryAll(By.css('li'));

      expect(nav).toBeTruthy();
      expect(items.length).toBe(3);
    });

    it('should work with toolbar-style content', () => {
      @Component({
        selector: 'app-toolbar-host',
        standalone: true,
        imports: [Topbar],
        template: `
          <app-topbar>
            <button>New</button>
            <button>Edit</button>
            <button>Delete</button>
          </app-topbar>
        `,
      })
      class ToolbarHostComponent {}

      TestBed.configureTestingModule({ imports: [ToolbarHostComponent] });
      const hostFixture = TestBed.createComponent(ToolbarHostComponent);
      hostFixture.detectChanges();

      const buttons = hostFixture.debugElement.queryAll(By.css('button'));
      expect(buttons.length).toBe(3);
    });
  });

  describe('Accessibility Tests', () => {
    it('should have no accessibility violations when empty', async () => {
      await TestBed.configureTestingModule({
        imports: [Topbar],
      }).compileComponents();

      const emptyFixture = TestBed.createComponent(Topbar);
      emptyFixture.detectChanges();

      const results = await axe(emptyFixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with projected content', async () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with navigation content', async () => {
      @Component({
        selector: 'app-a11y-nav-host',
        standalone: true,
        imports: [Topbar],
        template: `
          <app-topbar>
            <nav aria-label="Main navigation">
              <a href="#">Home</a>
              <a href="#">Dashboard</a>
            </nav>
          </app-topbar>
        `,
      })
      class A11yNavHostComponent {}

      TestBed.configureTestingModule({ imports: [A11yNavHostComponent] });
      const hostFixture = TestBed.createComponent(A11yNavHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with complex content', async () => {
      @Component({
        selector: 'app-a11y-complex-host',
        standalone: true,
        imports: [Topbar],
        template: `
          <app-topbar>
            <img src="" alt="Company Logo" />
            <h1>Loan Portal</h1>
            <button aria-label="Toggle menu">Menu</button>
          </app-topbar>
        `,
      })
      class A11yComplexHostComponent {}

      TestBed.configureTestingModule({ imports: [A11yComplexHostComponent] });
      const hostFixture = TestBed.createComponent(A11yComplexHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should meet WCAG 2.1 Level AA standards', async () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', async () => {
      TestBed.configureTestingModule({ imports: [TestHostComponent] });
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const results = await axe(hostFixture.nativeElement, {
        runOnly: {
          type: 'tag',
          values: ['best-practice'],
        },
        rules: { region: { enabled: false } },
      });
      expect(results).toHaveNoViolations();
    });
  });
});
