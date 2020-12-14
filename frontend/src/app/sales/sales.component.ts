import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Sale } from 'tinystock-models';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  sales: Sale[] = []
  loading = false

  displayedSales = new BehaviorSubject(this.sales)

  columnsToDisplay = ['date', 'items', 'adjustments'];

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.loading = true
    this.apiService.sales().then(sales => {
      this.loading = false
      this.sales = sales
      this.displayedSales.next(this.sales)
    }).catch(err => {
      this.loading = false
      this.sales = []
      this.errorService.showError(err)
      this.displayedSales.next(this.sales)
    })
  }

  toDateString(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  back() {
    this.location.back()
  }

}
