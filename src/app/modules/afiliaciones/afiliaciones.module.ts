import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '@app/modules/shared/shared.module';
import { ActividadesClientesModule } from '@app/modules/actividades-clientes/actividades-clientes.module';
import { ErrorInterceptor } from '@app/modules/core/helpers/error.interceptor';
import { JwtInterceptor } from '@app/modules/security/helpers';
import { AfiliacionesRoutingModule } from './afiliaciones-routing.module';
import { AfiliacionesDetailComponent } from './afiliaciones-detail/afiliaciones-detail.component';
import { AfiliacionesListComponent } from './afiliaciones-list/afiliaciones-list.component';
import { PotencialExitoComponent } from './dialog-potencial-exito/dialog-potencial-exito.component';
import { AfiliacionesComponent } from './afiliaciones.component';
import { AfiliacionesService } from './afiliaciones.service';

@NgModule({
    declarations: [
        AfiliacionesComponent,
        AfiliacionesDetailComponent,
        AfiliacionesListComponent,
        PotencialExitoComponent
    ],
    imports: [
      SharedModule,
      ActividadesClientesModule,
      AfiliacionesRoutingModule,
      // Specify ng-circle-progress as an import
      NgCircleProgressModule.forRoot({
        // set defaults here
        radius: 100,
        outerStrokeWidth: 22,
        innerStrokeWidth: 10,
        outerStrokeColor: '#78C000',
        innerStrokeColor: '#C7E596',
        animation: false,
        responsive: true,
        renderOnClick: false,
        showTitle: true,
        showSubtitle: false,

        // titleFontSize: '100',
        // showUnits: false,
        showUnits: true,
        titleFontSize: '72',
        unitsFontSize: '68',
        space: -4
      })
    ],
    exports: [
      AfiliacionesComponent,
      AfiliacionesDetailComponent,
      AfiliacionesListComponent
  ],
  entryComponents: [PotencialExitoComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        AfiliacionesService
    ]
})
export class AfiliacionesModule { }
