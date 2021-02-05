import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { Adjustment, Item } from 'tinystock-models'
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

  @ViewChild('codeInput') codeElement: ElementRef;

  constructor(private apiService: ApiService, private errorService: ErrorService, private location: Location) { }

  submitting = false

  transactionItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([])
  adjustments: BehaviorSubject<Adjustment[]> = new BehaviorSubject<Adjustment[]>([])

  columnsToDisplay = ['code', 'setQuantity', 'description', 'quantity', 'category', 'itemprice', 'totalprice', 'remove'];

  itemForm = new FormGroup({
    code: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    setQuantity: new FormControl('')
  })

  adjustmentForm = new FormGroup({
    note: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required)
  });

  total: number = 0

  subscriptions: Subscription[] = []
  
  ngOnInit() {
    setTimeout(() => {
      this.codeElement.nativeElement.focus()
    })
    this.subscriptions.push(this.transactionItems.subscribe(transactionItems => {
      this.total = 0
      transactionItems.forEach(transactionItem => this.total += transactionItem.price * transactionItem.quantity)
    }))
  }

  addItem() {
    if (this.itemForm.valid) {
      this.submitting = true
      this.apiService.findItem(this.itemForm.controls['code'].value, this.itemForm.controls['setQuantity'].value).then(item => {
        if (item.quantity < this.itemForm.controls['quantity'].value) {
          this.errorService.showSimpleSnackBar(`Can\'t add ${this.itemForm.controls['quantity'].value} units as only ${item.quantity} left in stock`)
        } else {
          item.quantity = this.itemForm.controls['quantity'].value
          if (!this.transactionItems.value.find(item => item.code == this.itemForm.controls['code'].value && item.setQuantity == (this.itemForm.controls['setQuantity'].value ? this.itemForm.controls['setQuantity'].value : null))) {
            let tempSI = this.transactionItems.value
            tempSI.push(item)
            this.transactionItems.next(tempSI)
            this.itemForm.reset()
          } else {
            this.errorService.showSimpleSnackBar('Item already in list')
          }
        }
        this.submitting = false
      }).catch(err => {
        this.submitting = false
        this.errorService.showError(err)
      })
    }
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
      this.apiService.makeTransaction(this.transactionItems.value, this.adjustments.value).then(transaction => {
        this.submitting = false
        this.errorService.showSimpleSnackBar('Transaction saved')
        this.itemForm.reset()
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
