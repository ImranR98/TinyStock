import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { HttpClientModule } from '@angular/common/http';
import { ConfigurationComponent } from './configuration/configuration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms'

import { FlexLayoutModule } from '@angular/flex-layout'

import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDividerModule } from '@angular/material/divider'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialogModule } from '@angular/material/dialog'
import { MatAutocompleteModule } from '@angular/material/autocomplete'

import { ItemsComponent } from './items/items.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { KeyboardShortcutsComponent } from './keyboard-shortcuts/keyboard-shortcuts.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { AddItemModalComponent } from './add-item/add-item-modal/add-item-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfigurationComponent,
    ItemsComponent,
    AddItemComponent,
    EditItemComponent,
    AddTransactionComponent,
    TransactionsComponent,
    KeyboardShortcutsComponent,
    ItemSearchComponent,
    AddItemModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
