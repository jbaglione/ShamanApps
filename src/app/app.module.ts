import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { CommonService } from '@app/services/common.service';
import { CoreModule } from '@app/modules/core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    CoreModule
  ],
  providers: [
    CommonService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


