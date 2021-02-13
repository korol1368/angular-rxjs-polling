import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PollingService {
  constructor(private http: HttpClient) {}

  poll<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
