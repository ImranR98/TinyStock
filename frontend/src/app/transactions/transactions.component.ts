import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from 'tinystock-models';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = []
  loading = false

  displayedTransactions = new BehaviorSubject(this.transactions)

  columnsToDisplay = ['date', 'items', 'adjustments']

  @ViewChild('makeTransaction', { read: ElementRef }) makeTransactionElement: ElementRef

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.makeTransactionElement.nativeElement.focus()
    })
    this.loading = true
    this.apiService.transactions().then(transactions => {
      this.loading = false
      this.transactions = transactions
      this.displayedTransactions.next(this.transactions)
    }).catch(err => {
      this.loading = false
      this.transactions = []
      this.errorService.showError(err)
      this.displayedTransactions.next(this.transactions)
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
