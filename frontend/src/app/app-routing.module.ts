import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { HomeComponent } from './home/home.component';
import { ItemsComponent } from './items/items.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionTypes } from 'tinystock-models';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    data: { animation: 'configuration' }
  },
  {
    path: 'items',
    component: ItemsComponent,
    data: { animation: 'items' }
  },
  {
    path: 'addItem',
    component: AddItemComponent,
    data: { animation: 'addItem' }
  },
  {
    path: 'editItem',
    component: EditItemComponent,
    data: { animation: 'editItem' }
  },
  {
    path: 'buy',
    component: AddTransactionComponent,
    data: { animation: 'buy', type: TransactionTypes.PURCHASE }
  },
  {
    path: 'sales',
    component: TransactionsComponent,
    data: { animation: 'sales', type: TransactionTypes.SALE }
  },
  {
    path: 'sell',
    component: AddTransactionComponent,
    data: { animation: 'sell', type: TransactionTypes.SALE }
  },
  {
    path: 'purchases',
    component: TransactionsComponent,
    data: { animation: 'purchases', type: TransactionTypes.PURCHASE }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
