import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Adjustment, AppError, AppErrorCodes, Item, Sale } from 'tinystock-models'
import { IpcRenderer } from 'electron'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private ipc: IpcRenderer

  constructor(private http: HttpClient) {
    if ((<any>window).require) {
      console.log('Running as Electron client')
      this.ipc = (<any>window).require('electron').ipcRenderer
    } else {
      console.log('Running as Web client')
    }
  }

  minPasswordLength = 5

  electronWaitTime = 5000 // How many ms to wait for responses (only used in Electron mode, not when in a browser)

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  hostValue = new BehaviorSubject(this.host)

  dataDirValue = new BehaviorSubject(this.dataDir)

  passwordValue = new BehaviorSubject(this.rememberPassword ? this.password : '')

  rememberPasswordValue = new BehaviorSubject(this.rememberPassword)

  set host(host: string | null) {
    this.hostValue.next(host)
    localStorage.setItem('host', host)
  }

  get host() {
    let host = localStorage.getItem('host')
    if (!host) return ''
    else return host
  }

  set dataDir(dataDir: string) {
    this.dataDirValue.next(dataDir)
    localStorage.setItem('dataDir', dataDir)
  }

  get dataDir() {
    let dataDir = localStorage.getItem('dataDir')
    if (!dataDir) return ''
    else return dataDir
  }

  set password(password: string) {
    this.passwordValue.next(password)
    if (this.rememberPassword) localStorage.setItem('password', password)
  }

  get password() {
    if (this.rememberPassword) {
      let password = localStorage.getItem('password')
      if (!password) return ''
      else return password
    } else return this.passwordValue.value
  }

  set rememberPassword(rememberPassword: boolean) {
    this.rememberPasswordValue.next(rememberPassword)
    localStorage.setItem('rememberPassword', JSON.stringify(rememberPassword))
    if (!rememberPassword) this.clearPassword()
  }

  get rememberPassword() {
    let rememberPassword = localStorage.getItem('rememberPassword')
    if (!rememberPassword) return false
    else return !!JSON.parse(rememberPassword)
  }

  clearPassword() {
    localStorage.removeItem('password')
  }

  // This client may run either in a Web browser or an Electron container
  // Therefore, requests to the 'backend' may either be Electron IPC requests or Web requests to a server
  // All below requests check for the presence of the Electron IPC variable and then use the appropriate method

  configure(host: string, dataDir: string, password: string) {
    const body = { dataDir, password }
    if (this.ipc) {
      return new Promise<null>((resolve, reject) => {
        this.ipc.once('configureResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('configureError', (event, error) => {
          reject(error)
        })
        this.ipc.send('configure', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(host + '/api/configure', body).toPromise() as Promise<null>
  }

  items() {
    const body = { dataDir: this.dataDir, password: this.password }
    if (this.ipc) {
      return new Promise<Item[]>((resolve, reject) => {
        this.ipc.once('itemsResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('itemsError', (event, error) => {
          reject(error)
        })
        this.ipc.send('items', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/items', body).toPromise() as Promise<Item[]>
  }

  sales() {
    const body = { dataDir: this.dataDir, password: this.password }
    if (this.ipc) {
      return new Promise<Sale[]>((resolve, reject) => {
        this.ipc.once('salesResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('salesError', (event, error) => {
          reject(error)
        })
        this.ipc.send('sales', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/sales', body).toPromise() as Promise<Sale[]>
  }

  addItem(item: Item) {
    if (typeof item.setQuantity == 'string') item.setQuantity = null
    const body = { dataDir: this.dataDir, password: this.password, item }
    if (this.ipc) {
      return new Promise<null>((resolve, reject) => {
        this.ipc.once('addItemResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('addItemError', (event, error) => {
          reject(error)
        })
        this.ipc.send('addItem', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/addItem', body).toPromise() as Promise<null>
  }

  findItem(code: string, setQuantity: string | null) {
    const body = { dataDir: this.dataDir, password: this.password, code, setQuantity }
    if (this.ipc) {
      return new Promise<Item>((resolve, reject) => {
        this.ipc.once('findItemResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('findItemError', (event, error) => {
          reject(error)
        })
        this.ipc.send('findItem', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/findItem', body).toPromise() as Promise<Item>
  }

  editItem(item: Item) {
    if (typeof item.setQuantity == 'string') item.setQuantity = null
    const body = { dataDir: this.dataDir, password: this.password, item }
    if (this.ipc) {
      return new Promise<null>((resolve, reject) => {
        this.ipc.once('editItemResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('editItemError', (event, error) => {
          reject(error)
        })
        this.ipc.send('editItem', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/editItem', body).toPromise() as Promise<null>
  }

  deleteItem(code: string, setQuantity: string | null) {
    const body = { dataDir: this.dataDir, password: this.password, code, setQuantity }
    if (this.ipc) {
      return new Promise<null>((resolve, reject) => {
        this.ipc.once('deleteItemResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('deleteItemError', (event, error) => {
          reject(error)
        })
        this.ipc.send('deleteItem', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/deleteItem', body).toPromise() as Promise<null>
  }

  makeSale(saleItems: Item[], adjustments: Adjustment[]) {
    const body = { dataDir: this.dataDir, password: this.password, saleItems, adjustments }
    if (this.ipc) {
      return new Promise<Sale>((resolve, reject) => {
        this.ipc.once('makeSaleResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('makeSaleError', (event, error) => {
          reject(error)
        })
        this.ipc.send('makeSale', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/makeSale', body).toPromise() as Promise<Sale>
  }

  changePassword(password: string, newPassword: string) {
    const body = { dataDir: this.dataDir, password, newPassword }
    if (this.ipc) {
      return new Promise<null>((resolve, reject) => {
        this.ipc.once('changePasswordResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('changePasswordError', (event, error) => {
          reject(error)
        })
        this.ipc.send('changePassword', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/changePassword', body).toPromise() as Promise<null>
  }

  importData(items: Item[], sales: Sale[]) {
    const body = { dataDir: this.dataDir, password: this.password, items, sales }
    if (this.ipc) {
      return new Promise<null>((resolve, reject) => {
        this.ipc.once('importDataResponse', (event, response) => {
          resolve(response)
        })
        this.ipc.once('importDataError', (event, error) => {
          reject(error)
        })
        this.ipc.send('importData', body)
        setTimeout(() => {
          reject(new AppError(AppErrorCodes.ELECTRON_TIME_OUT))
        }, this.electronWaitTime)
      })
    } else return this.http.post(this.host + '/api/importData', body).toPromise() as Promise<null>
  }
}
