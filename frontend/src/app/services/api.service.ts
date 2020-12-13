import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Adjustment, Item, Sale } from 'tinystock-models'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  minPasswordLength = 5

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

  configure(host: string, dataDir: string, password: string) {
    return this.http.post(host + '/api/configure', { dataDir, password }).toPromise()
  }

  items() {
    return this.http.post(this.host + '/api/items', { dataDir: this.dataDir, password: this.password }).toPromise() as Promise<Item[]>
  }

  sales() {
    return this.http.post(this.host + '/api/sales', { dataDir: this.dataDir, password: this.password }).toPromise() as Promise<Item[]>
  }

  addItem(item: Item) {
    if (typeof item.setQuantity == 'string') item.setQuantity = null
    return this.http.post(this.host + '/api/addItem', { dataDir: this.dataDir, password: this.password, item }).toPromise()
  }

  findItem(code: string, setQuantity: string | null) {
    return this.http.post(this.host + '/api/findItem', { dataDir: this.dataDir, password: this.password, code, setQuantity }).toPromise() as Promise<Item>
  }

  editItem(item: Item) {
    if (typeof item.setQuantity == 'string') item.setQuantity = null
    return this.http.post(this.host + '/api/editItem', { dataDir: this.dataDir, password: this.password, item }).toPromise()
  }

  deleteItem(code: string, setQuantity: string | null) {
    return this.http.post(this.host + '/api/deleteItem', { dataDir: this.dataDir, password: this.password, code, setQuantity }).toPromise()
  }

  makeSale(saleItems: Item[], adjustments: Adjustment[]) {
    return this.http.post(this.host + '/api/makeSale', { dataDir: this.dataDir, password: this.password, saleItems, adjustments }).toPromise() as Promise<Sale>
  }

  changePassword(password: string, newPassword: string) {
    return this.http.post(this.host + '/api/changePassword', { dataDir: this.dataDir, password, newPassword }).toPromise() as Promise<Sale>
  }

  importData(items: Item[], sales: Sale[]) {
    return this.http.post(this.host + '/api/changePassword', { dataDir: this.dataDir, password: this.password, items, sales }).toPromise() as Promise<Sale>
  }
}
