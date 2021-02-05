import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'tinystock-models';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  items: Item[] = []
  loading = false

  displayedItems = new BehaviorSubject(this.items)

  columnsToDisplay = ['code', 'setQuantity', 'description', 'quantity', 'category', 'cost', 'price', 'edit']

  @ViewChild('addItem', { read: ElementRef }) addItemElement: ElementRef

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private location: Location, private helper: HelperService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.addItemElement.nativeElement.focus()
    })
    this.loading = true
    this.apiService.items().then(items => {
      this.loading = false
      this.items = items
      this.displayedItems.next(this.items)
    }).catch(err => {
      this.loading = false
      this.items = []
      this.errorService.showError(err)
      this.displayedItems.next(this.items)
    })
  }

  commafy(num: number) { return this.helper.commafy(num) }

  edit(code: string, setQuantity: number | null) {
    this.router.navigate(['/editItem'], { queryParams: { code, setQuantity } })
  }

  back() {
    this.location.back()
  }

}
