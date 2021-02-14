import {Injectable} from '@angular/core';
import {fromEvent, Observable, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {concatMapTo, filter, map, repeatWhen, shareReplay, takeUntil} from 'rxjs/operators';
import {environment} from '../../environments/environment';

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

  whenPageVisible = () => {
    const visibilitychange$ = fromEvent(document, 'visibilitychange').pipe(
      shareReplay({refCount: true, bufferSize: 1})
    );

    const pageVisible$ = visibilitychange$.pipe(filter(() => document.visibilityState === 'visible'));

    const pageHidden$ = visibilitychange$.pipe(filter(() => document.visibilityState === 'hidden'));

    return function <T>(source: Observable<T>) {
      return source.pipe(
        takeUntil(pageHidden$),
        repeatWhen(() => pageVisible$)
      );
    };
  };

  poll<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url)
      .pipe(this.pollWithPeriod(environment.period), this.whenOnline(), this.whenPageVisible());
  }
}
