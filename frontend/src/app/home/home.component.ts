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
    this.apiService.helloWorld().then((result: { result: string}) => this.message = result.result).catch(err => this.message = JSON.parse(err))
  }

}
