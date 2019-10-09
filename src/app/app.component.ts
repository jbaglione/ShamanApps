import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { registerWebPlugin, Plugins, StatusBarStyle } from '@capacitor/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})

export class AppComponent implements OnInit {

  title = 'ExtranetApps-angular';

  constructor(
    private platform: Platform,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(`excel_icon`, this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/excel-icon.svg'));
      this.initializeApp();
  }

  ngOnInit() {
    console.log('Register custom capacitor plugins');
    registerWebPlugin(FileSharer);
    // other stuffg
  }

  async initializeApp() {
    const { SplashScreen, StatusBar } = Plugins;
    try {
      await SplashScreen.hide();
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
      if (this.platform.is('android')) {
        StatusBar.setBackgroundColor({ color: '#CDCDCD' });
      }
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }
}
