import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor() { }

  getTimePhrase = (now: Date = new Date()) => {
    if (now.getHours() == 0 || now.getHours() >= 18) return 'Evening'
    if (now.getHours() >= 12) return 'Afternoon'
    return 'Morning'
  }
}
