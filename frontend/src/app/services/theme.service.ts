import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  themeSource = new BehaviorSubject(themes.responsiveTheme);

  updateTheme(theme: themes) {
    this.themeSource.next(theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  }

  loadTheme() {
    let storedTheme: themes
    storedTheme = Number.parseInt(localStorage.getItem('theme'))
    if (isNaN(storedTheme)) storedTheme = themes.responsiveTheme
    this.updateTheme(storedTheme)
  }
}

export enum themes {
  lightTheme, darkTheme, responsiveTheme
}