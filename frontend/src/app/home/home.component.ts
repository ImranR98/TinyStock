import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: string = 'Loading'

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.helloWorld().then((result: { data: string }) => this.message = result.data).catch(err => this.message = JSON.parse(err))
  }

}
