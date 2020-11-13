import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TinyStock';

  constructor(private apiService: ApiService, private router: Router, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.apiService.dataDirValue.subscribe(dataDir => {
      if (!dataDir) this.router.navigate(['configuration'])
    })
    this.matIconRegistry.addSvgIcon(
      "back",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/back.svg")
    )
  }
}
