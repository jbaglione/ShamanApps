import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})

export class AppComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        `excel_icon`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/excel-icon.svg')
      );
  }
  title = 'ExtranetApps-angular';
}
