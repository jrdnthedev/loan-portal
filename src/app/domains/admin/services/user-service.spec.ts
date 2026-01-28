import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user-service';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import { environment } from '../../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return an array of users', () => {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          role: 'admin',
          firstName: 'John',
          lastName: 'Doe',
          phone: '123-456-7890',
        },
        {
          id: '2',
          email: 'user2@example.com',
          role: 'loan-officer',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '987-654-3210',
        },
      ];

      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should return an empty array when no users exist', () => {
      service.getUsers().subscribe((users) => {
        expect(users).toEqual([]);
        expect(users.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle error when fetching users fails', () => {
      const errorMessage = 'Failed to load users';

      service.getUsers().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/users`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUser', () => {
    it('should return a single user by id', () => {
      const mockUser: User = {
        id: '123',
        email: 'user@example.com',
        role: 'underwriter',
        firstName: 'Bob',
        lastName: 'Johnson',
        phone: '555-123-4567',
      };

      service.getUser('123').subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.id).toBe('123');
        expect(user.email).toBe('user@example.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/users/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when user is not found', () => {
      const userId = '999';

      service.getUser(userId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/users/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });

    it('should use the correct URL with user id', () => {
      const userId = 'abc-123';

      service.getUser(userId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/users/${userId}`);
      expect(req.request.url).toBe(`${apiUrl}/users/${userId}`);
      req.flush({});
    });
  });
});
