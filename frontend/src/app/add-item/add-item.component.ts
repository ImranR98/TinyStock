import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  @ViewChild('code') codeElement: ElementRef

  constructor(private apiService: ApiService, private errorService: ErrorService, private location: Location) { }

  submitting = false

  addItemForm = new FormGroup({
    code: new FormControl('', Validators.required),
    setQuantity: new FormControl(''),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });

  ngOnInit() {
    setTimeout(() => {
      this.codeElement.nativeElement.focus()
    })
  }

  add() {
    if (this.addItemForm.valid) {
      if ((!this.addItemForm.controls['setQuantity'].value || this.addItemForm.controls['setQuantity'].value > 0) && this.addItemForm.controls['price'].value >= 0) {
        this.submitting = true
        let item = this.addItemForm.value
        item.quantity = 0
        this.apiService.addItem(item).then(() => {
          this.submitting = false
          this.addItemForm.reset()
          this.errorService.showSimpleSnackBar('Added')
        }).catch(err => {
          this.submitting = false
          this.errorService.showError(err)
        })
      }
    }
  }

  back() {
    this.location.back()
  }

}
