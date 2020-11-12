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

  set host(host: string | null) {
    this.hostValue.next(host)
    localStorage.setItem('host', host)
  }

  get host() {
    let host = localStorage.getItem('host')
    if (!host) return ''
  }

  set dataDir(dataDir: string) {
    this.dataDirValue.next(dataDir)
    localStorage.setItem('dataDir', dataDir)
  }

  get dataDir() {
    return localStorage.getItem('dataDir')
  }

  validateDataDir(dataDir: string) {
    return this.http.post(this.host + '/api/validateDataDir', { dataDir }).toPromise()
  }

  addItem(item: Item) {
    return this.http.post(this.host + '/api/addItem', { dataDir: this.dataDir, item }).toPromise()
  }

  findItem(code: string, setQuantity: string | null) {
    return this.http.post(this.host + '/api/findItem', { dataDir: this.dataDir, code, setQuantity }).toPromise()
  }

  makeSale(saleItems: Item[], adjustments: Adjustment[]) {
    return this.http.post(this.host + '/api/makeSale', { dataDir: this.dataDir, saleItems, adjustments }).toPromise()
  }
}
