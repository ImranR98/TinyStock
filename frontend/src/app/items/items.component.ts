import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'tinystock-models';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  items: Item[] = []
  loading = false

  displayedItems = new BehaviorSubject(this.items)

  columnsToDisplay = ['code', 'setQuantity', 'description', 'quantity', 'category', 'price', 'edit'];

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private location: Location) { }

  ngOnInit(): void {
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

  edit(code: string, setQuantity: number | null) {
    this.router.navigate(['/editItem'], { queryParams: { code, setQuantity } })
  }

  back() {
    this.location.back()
  }

}
