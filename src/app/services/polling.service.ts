import {Injectable} from '@angular/core';
import {fromEvent, Observable, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {concatMapTo, filter, map, repeatWhen, takeUntil} from 'rxjs/operators';

@Injectable()
export class PollingService {
  constructor(private http: HttpClient) {}

  pollWithPeriod = (period: number, initialDelay = 0) => {
    return <T>(source: Observable<T>) => {
      return timer(initialDelay, period).pipe(concatMapTo(source));
    };
  };

  poll<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(this.pollWithPeriod(10000));
  }
}
