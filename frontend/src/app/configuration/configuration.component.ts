import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

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

  needDataDir = true
  needPassword = true
  needNewPassword = true

  directoryExists = false

  ngOnInit() {
    this.configForm.controls['dataDir'].valueChanges.subscribe((value: string) => {
      this.needDataDir = (value.trim() == '')
    })
    this.configForm.controls['password'].valueChanges.subscribe((value: string) => {
      this.needPassword = (value.length < this.apiService.minPasswordLength)
    })
    this.changePasswordForm.controls['newPassword'].valueChanges.subscribe((value: string) => {
      this.needNewPassword = (value.length < this.apiService.minPasswordLength)
    })
    this.apiService.dataDirValue.subscribe(dataDir => {
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
    })
    this.apiService.passwordValue.subscribe(password => {
      this.configForm.controls['password'].setValue(password)
    })
    this.apiService.hostValue.subscribe(host => {
      this.configForm.controls['host'].setValue(host)
    })
    this.apiService.rememberPasswordValue.subscribe(rememberPassword => {
      this.configForm.controls['rememberPassword'].setValue(rememberPassword)
    })
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

  back() {
    this.location.back()
  }

  getMinPasswordLength() {
    return this.apiService.minPasswordLength
  }

}
