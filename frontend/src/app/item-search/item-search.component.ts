import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Item } from 'tinystock-models';
import { ApiService } from '../services/api.service';
import { startWith, map } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddItemModalComponent } from '../add-item/add-item-modal/add-item-modal.component';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss']
})
export class ItemSearchComponent implements OnInit, AfterViewInit {
  @Input() buttonText: string = 'Add'
  @Input() submitting: boolean = false
  @Input() reset: Observable<void> | null = null
  @Output() error = new EventEmitter<any>()
  @Output() item = new EventEmitter<{ item: Item, quantityAvailable: number }>()
  @ViewChild('codeInput') codeInput: ElementRef

  constructor(private apiService: ApiService, private dialog: MatDialog) { }

  addDialog: MatDialogRef<AddItemModalComponent, any> | null = null

  itemForm = new FormGroup({
    item: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
  })

  items: Item[] = []

  loading: boolean = false

  filteredOptions: Observable<Item[]>

  selectedItem: Item | null = null

  loadItems() {
    this.itemForm.controls['item'].disable()
    this.loading = true
    this.apiService.items().then(items => {
      this.items = items
      this.itemForm.controls['item'].enable()
      this.itemForm.controls['item'].setValue('')
      this.codeInput?.nativeElement?.focus()
      this.loading = false
    }).catch(err => {
      this.loading = false
      this.itemForm.controls['item'].enable()
      this.error.emit(err)
    })
  }

  addItem() {
    if (!this.addDialog) {
      this.addDialog = this.dialog.open(AddItemModalComponent)
      this.addDialog.afterClosed().subscribe(() => {
        this.loadItems()
        this.addDialog = null
      })
    } else {
      this.addDialog.close()
    }
  }

  ngOnInit(): void {
    this.itemForm.controls['quantity'].disable()
    this.loadItems()
    this.itemForm.controls['item'].valueChanges.subscribe(value => {
      let item = null
      for (let i = 0; i < this.items.length; i++) {
        if (this.displayFn(this.items[i]).trim() == value?.trim()) item = this.items[i]
      }
      this.selectedItem = item
      item ? this.itemForm.controls['quantity'].enable() : this.itemForm.controls['quantity'].disable()
    })
    this.filteredOptions = this.itemForm.controls['item'].valueChanges
      .pipe(
        startWith(''),
        map(value => this.searchItem(value))
      )
    this.reset?.subscribe(() => {
      this.resetSearch()
    })
  }

  ngAfterViewInit() {
    this.codeInput.nativeElement.focus()
  }

  private searchItem(value: string): Item[] {
    const filterValue = value?.toLowerCase().split(' ').map(word => word.trim()).filter(word => word != '-') || ''
    return this.items.filter(item => {
      for (let i = 0; i < filterValue.length; i++) {
        if (!item.description.toLowerCase().includes(filterValue[i]) && !item.code.toLowerCase().includes(filterValue[i])) return false
      }
      return true
    })
  }

  displayFn(item: Item): string {
    if (item)
      return `${item.code} - ${item.description}${(item.setQuantity ? ` - Set of ${item.setQuantity}` : ``)}`
    else return ''
  }

  resetSearch() {
    this.itemForm.reset()
    this.codeInput?.nativeElement.focus()
  }

  submit() {
    if (!this.loading && !this.submitting && this.itemForm.valid && this.selectedItem) {
      let quantityAvailable = this.selectedItem.quantity
      this.selectedItem.quantity = Number.parseInt(this.itemForm.controls['quantity'].value)
      this.item.emit({ item: this.selectedItem, quantityAvailable })
      this.resetSearch()
    }
  }

}
