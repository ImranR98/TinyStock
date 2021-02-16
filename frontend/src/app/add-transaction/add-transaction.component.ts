import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { Adjustment, Item, TransactionTypes } from 'tinystock-models'
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

  @ViewChild('codeInput') codeElement: ElementRef;

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private route: ActivatedRoute, private location: Location, private helper: HelperService) { }

  submitting = false

  type: TransactionTypes = TransactionTypes.SALE;
  verb: string = ''

  transactionItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([])
  adjustments: BehaviorSubject<Adjustment[]> = new BehaviorSubject<Adjustment[]>([])

  columnsToDisplay = ['code', 'setQuantity', 'description', 'quantity', 'category', 'itemprice', 'totalprice', 'remove'];

  adjustmentForm = new FormGroup({
    note: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required)
  });

  resetSearchSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null)
  resetSearch() {
    this.resetSearchSubject.next()
  }

  total: number = 0

  subscriptions: Subscription[] = []

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (!(data.type in TransactionTypes)) {
        this.errorService.showSimpleSnackBar('Transaction type is not valid.')
        this.router.navigate(['/'])
      } else {
        this.type = data.type
        this.verb = this.helper.getTransactionTypeVerb(this.type)
      }
    })
    this.subscriptions.push(this.transactionItems.subscribe(transactionItems => {
      this.total = 0
      transactionItems.forEach(transactionItem => this.total += (this.isPurchaseType() ? transactionItem.cost : transactionItem.price) * transactionItem.quantity)
    }))
  }

  commafy(num: number) { return this.helper.commafy(num) }
  isPurchaseType() { return this.helper.isPurchaseType(this.type) }

  addItem({ item, quantityAvailable }: { item: Item, quantityAvailable: number }) {
    this.submitting = true
    let tempTI = this.transactionItems.value
    let existingIndex = this.transactionItems.value.findIndex(existingItem => existingItem.code == item.code && existingItem.setQuantity == item.setQuantity)
    if (existingIndex < 0) {
      tempTI.push(item)
      existingIndex = tempTI.length - 1
    } else tempTI[existingIndex].quantity += item.quantity
    if (this.type == TransactionTypes.SALE && quantityAvailable < tempTI[existingIndex].quantity) {
      this.errorService.showSimpleSnackBar(`Can\'t add ${item.quantity} more units as only ${quantityAvailable} left in stock`)
    } else {
      this.transactionItems.next(tempTI)
    }
    this.submitting = false
  }

  searchError(err: any) {
    this.errorService.showError(err)
    this.back()
  }

  deleteItem(code: string, setQuantity: number | null) {
    let ind = this.transactionItems.value.findIndex(item => item.code == code && item.setQuantity == setQuantity)
    let tempSI = this.transactionItems.value
    if (ind >= 0) tempSI.splice(ind)
    this.transactionItems.next(tempSI)
    if (this.transactionItems.value.length == 0) this.removeAdjustment()
  }

  adjust() {
    if (this.adjustments.value.length == 0) {
      let amount: number = Number.parseFloat(prompt('Adjustment amount?'))
      if (Number.isNaN(amount)) this.errorService.showSimpleSnackBar('Invalid input')
      else {
        let note = prompt('Adjustment note?')
        let tempAdj = this.adjustments.value
        tempAdj.push(new Adjustment(note, amount))
        this.adjustments.next(tempAdj)
      }
    }
  }

  removeAdjustment() {
    if (this.adjustments.value.length > 0) this.adjustments.next([])
  }

  addTransaction() {
    if (confirm('Finalize this transaction?') && this.transactionItems.value.length > 0) {
      this.submitting = true
      this.apiService.makeTransaction(this.transactionItems.value, this.adjustments.value, this.type).then(transaction => {
        this.submitting = false
        this.errorService.showSimpleSnackBar('Transaction saved')
        this.resetSearch()
        this.transactionItems.next([])
        this.adjustments.next([])
      }).catch(err => {
        this.submitting = false
        this.errorService.showError(err)
      })
    }
  }

  back() {
    this.location.back()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
