import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Adjustment, Item, Sale } from 'tinystock-models'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  hostValue = new BehaviorSubject(this.host)

  dataDirValue = new BehaviorSubject(this.dataDir)

  passwordValue = new BehaviorSubject(this.password)

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
    localStorage.setItem('password', password)
  }

  get password() {
    let password = localStorage.getItem('password')
    if (!password) return ''
    else return password
  }

  createOrCheckDataDir(dataDir: string) {
    return this.http.post(this.host + '/api/createOrCheckDataDir', { dataDir, password: this.password }).toPromise()
  }

  items() {
    return this.http.post(this.host + '/api/items', { dataDir: this.dataDir, password: this.password }).toPromise() as Promise<Item[]>
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
}
