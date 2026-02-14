import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      authState: signal({
        user: {
          id: '123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-1234',
          role: 'admin',
        },
      }),
    };

    mockRouter = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data', () => {
    expect(component.profileModel().firstname).toBe('John');
    expect(component.profileModel().lastname).toBe('Doe');
    expect(component.profileModel().email).toBe('john@example.com');
  });

  it('should navigate to shell on dashboard click', () => {
    component.handleDashboardClick();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/shell');
  });

  it('should log on activity log click', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.handleActivityLogClick();
    expect(consoleSpy).toHaveBeenCalledWith('activity log button clicked!');
  });
});
