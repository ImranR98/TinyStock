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

  needDataDir = true
  needPassword = true

  ngOnInit() {
    this.configForm.controls['dataDir'].valueChanges.subscribe((value: string) => {
      this.needDataDir = (value.trim() == '')
    })
    this.configForm.controls['password'].valueChanges.subscribe((value: string) => {
      this.needPassword = (value.trim() == '')
    })
    this.apiService.dataDirValue.subscribe(dataDir => {
      this.configForm.controls['dataDir'].setValue(dataDir)
      setTimeout(() => {
        if (dataDir.trim().length == 0)
          this.dataDirElement.nativeElement.focus()
        else
          this.passwordElement.nativeElement.focus()
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
    if (this.configForm.valid) {
      this.submitting = true
      this.apiService.createOrCheckDataDir(this.configForm.controls['host'].value?.trim(), this.configForm.controls['dataDir'].value?.trim(), this.configForm.controls['password'].value).then(() => {
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

  back() {
    this.location.back()
  }

}
