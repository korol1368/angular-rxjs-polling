import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PollingService} from './services/polling.service';
import {environment} from '../environments/environment';
import {ApiResponse} from './models/apiResponse.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  breeds$!: Observable<[]>;
  id$!: Observable<string>;
  url$!: Observable<string>;
  width$!: Observable<number>;
  height$!: Observable<number>;

  constructor(private appService: PollingService) {}

  ngOnInit(): void {
    this.appService.poll<ApiResponse[]>(environment.apiUrl).subscribe((result) => {
      const response = result[0];
      console.log(response.url);
    });
  }
}
