import {Component, OnInit} from '@angular/core';
import {PollingService} from './services/polling.service';
import {environment} from '../environments/environment';
import {ApiResponse} from './models/apiResponse.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  breeds!: [];
  id!: string;
  url!: string;
  width!: number;
  height!: number;

  constructor(private pollingService: PollingService) {}

  ngOnInit(): void {
    this.pollingService.poll<ApiResponse[]>(environment.apiUrl).subscribe((result) => {
      const response = result[0];
      this.breeds = response.breeds;
      this.id = response.id;
      this.url = response.url;
      this.width = response.width;
      this.height = response.height;
    });
  }
}
