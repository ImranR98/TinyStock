import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Transaction, TransactionTypes } from 'tinystock-models';
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

  type: TransactionTypes = TransactionTypes.SALE;

  @ViewChild('addTransaction', { read: ElementRef }) addTransactionElement: ElementRef

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (!(data.type in TransactionTypes)) {
        this.errorService.showSimpleSnackBar('Transaction type is not valid.')
        this.router.navigate(['/'])
      } else this.type = data.type
    })
    setTimeout(() => {
      this.addTransactionElement.nativeElement.focus()
    })
    this.loading = true
    this.apiService.transactions().then(transactions => {
      this.loading = false
      this.transactions = transactions
      this.displayedTransactions.next(this.transactions.filter(transaction => transaction.type == this.type))
    }).catch(err => {
      this.loading = false
      this.transactions = []
      this.errorService.showError(err)
      this.displayedTransactions.next(this.transactions)
    })
  }

  getTransactionTypeString() {
    switch (this.type) {
      case TransactionTypes.SALE:
        return 'Sale'
        break;
      case TransactionTypes.PURCHASE:
        return 'Purchase'
        break;
    }
  }

  toDateString(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  back() {
    this.location.back()
  }

}
