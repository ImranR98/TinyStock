import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild('password') passwordElement: ElementRef;
  @ViewChild('dataDir') dataDirElement: ElementRef;

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private location: Location) { }

  submitting = false

  configForm = new FormGroup({
    dataDir: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberPassword: new FormControl(false),
    host: new FormControl(''),
  });

  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required),
  })

  importForm = new FormGroup({
    itemsInput: new FormControl('', Validators.required),
    items: new FormControl('', Validators.required),
    transactionsInput: new FormControl('', Validators.required),
    transactions: new FormControl('', Validators.required)
  })

  needDataDir = true
  needPassword = true
  needNewPassword = true

  directoryExists = false

  subscriptions: Subscription[] = []

  ngOnInit() {
    this.subscriptions.push(this.configForm.controls['dataDir'].valueChanges.subscribe((value: string) => {
      this.needDataDir = (value.trim() == '')
    }))
    this.subscriptions.push(this.configForm.controls['password'].valueChanges.subscribe((value: string) => {
      this.needPassword = (value.length < this.apiService.minPasswordLength)
    }))
    this.subscriptions.push(this.changePasswordForm.controls['newPassword'].valueChanges.subscribe((value: string) => {
      this.needNewPassword = (value.length < this.apiService.minPasswordLength)
    }))
    this.subscriptions.push(this.apiService.dataDirValue.subscribe(dataDir => {
      this.configForm.controls['dataDir'].setValue(dataDir)
      setTimeout(() => {
        if (dataDir.trim().length == 0) {
          this.dataDirElement.nativeElement.focus()
          this.directoryExists = false
        }
        else {
          this.passwordElement.nativeElement.focus()
          this.directoryExists = true
        }
      })
    }))
    this.subscriptions.push(this.apiService.passwordValue.subscribe(password => {
      this.configForm.controls['password'].setValue(password)
    }))
    this.subscriptions.push(this.apiService.hostValue.subscribe(host => {
      this.configForm.controls['host'].setValue(host)
    }))
    this.subscriptions.push(this.apiService.rememberPasswordValue.subscribe(rememberPassword => {
      this.configForm.controls['rememberPassword'].setValue(rememberPassword)
    }))
  }

  save() {
    if (this.configForm.valid && this.configForm.controls['password'].value.length > this.apiService.minPasswordLength) {
      this.submitting = true
      this.apiService.configure(this.configForm.controls['host'].value?.trim(), this.configForm.controls['dataDir'].value?.trim(), this.configForm.controls['password'].value).then(() => {
        this.submitting = false
        this.apiService.host = this.configForm.controls['host'].value?.trim()
        this.apiService.dataDir = this.configForm.controls['dataDir'].value?.trim()
        this.apiService.rememberPassword = this.configForm.controls['rememberPassword'].value
        this.apiService.password = this.configForm.controls['password'].value
        this.errorService.showSimpleSnackBar('Configuration saved')
        this.router.navigate(['/home'])
      }).catch(err => {
        this.submitting = false
        this.errorService.showError(err)
      })
    }
  }

  changePassword() {
    if (this.changePasswordForm.valid && this.changePasswordForm.controls['newPassword'].value.length > this.apiService.minPasswordLength && this.configForm.controls['password'].valid) {
      this.submitting = true
      this.apiService.changePassword(this.configForm.controls['password'].value, this.changePasswordForm.controls['newPassword'].value).then(() => {
        this.submitting = false
        this.apiService.password = this.changePasswordForm.controls['newPassword'].value
        this.errorService.showSimpleSnackBar('Password changed')
        this.router.navigate(['/home'])
      }).catch(err => {
        this.submitting = false
        this.errorService.showError(err)
      })
    }
  }

  onItemsFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.importForm.patchValue({
        items: file
      });
    }
  }

  onTransactionsFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.importForm.patchValue({
        transactions: file
      });
    }
  }

  readFile(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsText(blob)
      reader.onload = () => {
        resolve(reader.result.toString())
      }
    })
  }

  downloadJSONObject(object: any, fileName: string) {
    const str = JSON.stringify(object)
    const bytes = new TextEncoder().encode(str)
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    })
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  async export() {
    try {
      let items = await this.apiService.items()
      let transactions = await this.apiService.transactions()
      this.downloadJSONObject(items, 'items.json')
      this.downloadJSONObject(transactions, 'transactions.json')
    } catch (err) {
      this.errorService.showError(err)
    }
  }

  async importFiles() {
    if (this.importForm.valid && confirm('Import these data files? Any existing data will be irreversibly replaced.')) {
      let items = []
      let transactions = []
      try {
        items = JSON.parse(await this.readFile(this.importForm.get('items').value))
        transactions = JSON.parse(await this.readFile(this.importForm.get('items').value))
      } catch (err) {
        this.errorService.showError(err)
      }
      this.submitting = true
      this.apiService.importData(items, transactions).then(() => {
        this.submitting = false
        this.errorService.showSimpleSnackBar('Data Imported')
        this.router.navigate(['/home'])
      }).catch(err => {
        this.submitting = false
        this.errorService.showError(err)
      })
    }
  }

  back() {
    this.location.back()
  }

  getMinPasswordLength() {
    return this.apiService.minPasswordLength
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
