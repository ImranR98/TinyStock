import { Injectable } from '@angular/core';
import { TransactionTypes } from 'tinystock-models';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  getTransactionTypeVerb(type: TransactionTypes) {
    switch (type) {
      case TransactionTypes.SALE:
        return 'Sell'
        break;
      case TransactionTypes.PURCHASE:
        return 'Buy'
        break;
    }
  }

  getTransactionTypeNoun(type: TransactionTypes) {
    switch (type) {
      case TransactionTypes.SALE:
        return 'Sale'
        break;
      case TransactionTypes.PURCHASE:
        return 'Purchase'
        break;
    }
  }

  isPurchaseType(type: TransactionTypes) {
    return type == TransactionTypes.PURCHASE
  }

  commafy(num: number) {
    let str = num.toString().split('.')
    if (str[0].length >= 4)
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    if (str[1] && str[1].length >= 4)
      str[1] = str[1].replace(/(\d{3})/g, '$1 ')
    return str.join('.')
  }
}
