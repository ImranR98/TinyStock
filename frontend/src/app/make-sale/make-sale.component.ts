import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { Adjustment, Item } from 'tinystock-models'
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-make-sale',
  templateUrl: './make-sale.component.html',
  styleUrls: ['./make-sale.component.scss']
})
export class MakeSaleComponent implements OnInit {

  @ViewChild('codeInput') codeElement: ElementRef;

  constructor(private apiService: ApiService, private errorService: ErrorService, private location: Location) { }

  submitting = false

  saleItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([])
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
    this.subscriptions.push(this.saleItems.subscribe(saleItems => {
      this.total = 0
      saleItems.forEach(saleItem => this.total += saleItem.price * saleItem.quantity)
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
          if (!this.saleItems.value.find(item => item.code == this.itemForm.controls['code'].value && item.setQuantity == (this.itemForm.controls['setQuantity'].value ? this.itemForm.controls['setQuantity'].value : null))) {
            let tempSI = this.saleItems.value
            tempSI.push(item)
            this.saleItems.next(tempSI)
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
    let ind = this.saleItems.value.findIndex(item => item.code == code && item.setQuantity == setQuantity)
    let tempSI = this.saleItems.value
    if (ind >= 0) tempSI.splice(ind)
    this.saleItems.next(tempSI)
    if (this.saleItems.value.length == 0) this.removeAdjustment()
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

  makeSale() {
    if (confirm('Finalize this sale?') && this.saleItems.value.length > 0) {
      this.submitting = true
      this.apiService.makeSale(this.saleItems.value, this.adjustments.value).then(sale => {
        this.submitting = false
        this.errorService.showSimpleSnackBar('Sale saved')
        this.itemForm.reset()
        this.saleItems.next([])
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
