import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Transaction, TransactionTypes } from 'tinystock-models';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = []
  loading = false

  displayedTransactions = new BehaviorSubject(this.transactions)

  columnsToDisplay = ['date', 'items', 'adjustments', 'total']

  type: TransactionTypes = TransactionTypes.SALE;
  noun: string = ''
  verb: string = ''

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute, private location: Location, private helper: HelperService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (!(data.type in TransactionTypes)) {
        this.errorService.showSimpleSnackBar('Transaction type is not valid.')
        this.router.navigate(['/'])
      } else {
        this.type = data.type
        this.noun = this.helper.getTransactionTypeNoun(this.type)
        this.verb = this.helper.getTransactionTypeVerb(this.type)
      }
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

  commafy(num: number) { return this.helper.commafy(num) }
  isPurchaseType() { return this.helper.isPurchaseType(this.type) }

  getTransactionTotal(transaction: Transaction) {
    let total = 0
    transaction.items.forEach(item => total += (this.isPurchaseType() ? item.cost : item.price) * item.quantity)
    transaction.adjustments.forEach(adjustment => total += adjustment.amount)
    return total
  }

  toDateString(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  back() {
    this.location.back()
  }

}
