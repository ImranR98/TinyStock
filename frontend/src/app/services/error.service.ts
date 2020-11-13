import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { instanceOfAppError, AppErrorCodes } from 'tinystock-models'

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) { }

  showSimpleSnackBar(message: string) {
    this.snackBar.dismiss()
    this.snackBar.open(message, 'Okay', {
      duration: 5000
    })
  }

  getAppErrorMessage(appErrorCode: AppErrorCodes) {
    switch (appErrorCode) {
      case AppErrorCodes.MISSING_DIRECTORY:
        return 'The data directory is missing'
        break;
      case AppErrorCodes.CORRUPT_ITEMS_JSON:
        return 'The items file is not a valid JSON file'
        break;
      case AppErrorCodes.CORRUPT_SALES_JSON:
        return 'The sales file is not a valid JSON file'
        break;
      case AppErrorCodes.MISSING_ITEMS_ARRAY:
        return 'The items file does not contain an array'
        break;
      case AppErrorCodes.MISSING_SALES_ARRAY:
        return 'The sales file does not contain an array'
        break;
      case AppErrorCodes.CORRUPT_ITEM_IN_JSON:
        return 'An item in the items file is invalid'
        break;
      case AppErrorCodes.CORRUPT_SALE_IN_JSON:
        return 'A sale in the sales file is invalid'
        break;
      case AppErrorCodes.ITEM_NOT_FOUND:
        return 'The item does not exist'
        break;
      case AppErrorCodes.QUANTITY_TOO_LOW:
        return 'The item\'s quantity is too low'
        break;
      case AppErrorCodes.ITEM_EXISTS:
        return 'The item already exists'
        break;
      case AppErrorCodes.INVALID_ITEM:
        return 'The item is invalid'
        break;
      case AppErrorCodes.INVALID_SALE:
        return 'This sale is invalid'
        break;
      case AppErrorCodes.MISSING_ARGUMENT:
        return 'One or more arguments are missing'
        break;
      case AppErrorCodes.INVALID_ARGUMENT:
        return 'One or more arguments are invalid'
        break;
      default:
        return 'Unknown application error'
        break;
    }
  }

  standardizeError(error: any, actionable: boolean = false) {
    let standardError: { message: string, actionable: boolean } = { message: 'Unknown Error', actionable: actionable }

    if (error instanceof HttpErrorResponse) {
      if (error.status == 404) {
        standardError.message = error.statusText
      } else if (instanceOfAppError(error.error)) {
        standardError.message = this.getAppErrorMessage(error.error.code)
      } else if (error.status == 200) {
        // GET requests to a non-existent route may result in the hosted app HTML itself being returned with a 200 status
        // It would result in an error since it's not valid JSON
        standardError.message = '404 - Not Found'
      } else {
        standardError.message = error.statusText
      }
    }

    if (typeof error == 'string') {
      standardError.message = error
    }

    return standardError
  }

  showError(error: any, callback: Function = null, duration: number = 5000) {
    console.log(error)
    error = this.standardizeError(error, (!!callback))
    this.snackBar.dismiss()
    let actionText = 'Okay'
    if (callback) {
      actionText = 'Retry'
    }
    if (duration) {
      this.snackBar.open(error.message, actionText, { duration: duration }).onAction().subscribe(() => {
        if (callback) {
          callback()
        }
      })
    } else {
      this.snackBar.open(error.message, actionText).onAction().subscribe(() => {
        if (callback) {
          callback()
        }
      })
    }

  }

  clearError() {
    this.snackBar.dismiss()
  }
}
