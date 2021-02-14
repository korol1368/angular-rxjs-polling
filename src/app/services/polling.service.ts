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

  whenOnline = () => {
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    return <T>(source: Observable<T>) => {
      return source.pipe(
        takeUntil(offline$),
        repeatWhen(() => online$)
      );
    };
  };

  poll<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(this.pollWithPeriod(10000), this.whenOnline());
  }
}
