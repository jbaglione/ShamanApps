import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { CoreModule } from '@app/modules/core/core.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { FileService } from '@app/modules/shared/services/files.service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      countDuplicates: true
    }),
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    DeviceDetectorModule.forRoot(),
    AgGridModule.withComponents([])
  ],
  providers: [
    FileService,
    // { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' , useClass: IonicRouteStrategy }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


