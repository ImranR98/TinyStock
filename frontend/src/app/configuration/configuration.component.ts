import { Component, OnInit } from '@angular/core';
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

  constructor(private apiService: ApiService, private errorService: ErrorService, private router: Router, private location: Location) { }

  submitting = false

  configForm = new FormGroup({
    dataDir: new FormControl('', Validators.required),
    host: new FormControl(''),
  });

  needDataDir = true

  ngOnInit() {
    this.apiService.dataDirValue.subscribe(dataDir => {
      this.configForm.controls['dataDir'].setValue(dataDir)
      if (dataDir.trim() != '') this.needDataDir = false
    })
    this.apiService.hostValue.subscribe(host => {
      this.configForm.controls['host'].setValue(host)
    })
  }

  save() {
    if (this.configForm.valid) {
      this.submitting = true
      this.apiService.host = this.configForm.controls['host'].value?.trim()
      this.apiService.validateDataDir(this.configForm.controls['dataDir'].value?.trim()).then(() => {
        this.submitting = false
        this.apiService.dataDir = this.configForm.controls['dataDir'].value?.trim()
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
