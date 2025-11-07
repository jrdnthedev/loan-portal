import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuditEntry } from '../models/audit-entry';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
}
