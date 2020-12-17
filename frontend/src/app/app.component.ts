import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser';

import { RouterOutlet } from '@angular/router';
import { fader } from './route-animations'
import { themes, ThemeService } from './services/theme.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fader]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TinyStock';

  subscriptions: Subscription[] = []

  @HostBinding('class') componentCssClass;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  constructor(private apiService: ApiService, private router: Router, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, public overlayContainer: OverlayContainer, private themeService: ThemeService) { }

  ngOnInit() {
    this.subscriptions.push(this.apiService.dataDirValue.subscribe(dataDir => {
      if (!dataDir) this.router.navigate(['configuration'])
    }))
    this.subscriptions.push(this.apiService.passwordValue.subscribe(password => {
      if (!password) this.router.navigate(['configuration'])
    }))
    this.matIconRegistry.addSvgIcon(
      "back",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/back.svg")
    )
    this.subscriptions.push(this.themeService.themeSource.subscribe((theme: themes) => {
      switch (theme) {
        case themes.darkTheme:
          this.setTheme('darkTheme')
          break;
        case themes.lightTheme:
          this.setTheme('lightTheme')
          break;
        case themes.responsiveTheme:
          this.setTheme('responsiveTheme')
          break;
        default:
          break;
      }
    }))
    this.themeService.loadTheme()
  }

  setTheme(theme) {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.endsWith('Theme'))
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove)
    }
    overlayContainerClasses.add(theme)
    this.componentCssClass = theme
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
