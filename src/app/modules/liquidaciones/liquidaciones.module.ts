import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { LiquidacionesRoutingModule } from './liquidaciones-routing.module';
import { LiquidacionesComponent } from './liquidaciones.component';
import { PrestacionesComponent } from './pages/prestaciones/prestaciones.component';
import { LiquidacionesService } from './liquidaciones.service';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { IncidenteDetalleComponent } from './pages/incidente-detalle/incidente-detalle.component';
import { RevisarPresentacionComponent } from './pages/revisar-presentacion/revisar-presentacion.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FilterComponent } from './components/filter/filter.component';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { ResumenDetalleComponent } from './components/resumen-detalle/resumen-detalle.component';
import { AsistenciaComponent } from './pages/asistencia/asistencia.component';
import { ChartsModule } from 'ng2-charts';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { ResumenHorasComponent } from './components/resumen-horas/resumen-horas.component';
import { UploadResultadoHisopadoComponent } from './components/upload-resultado-hisopado/upload-resultado-hisopado.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { PacientesCovidService } from '../pacientes-covid/pacientes-covid.service';

@NgModule({
  declarations: [
    LiquidacionesComponent,
    PrestacionesComponent,
    IncidenteDetalleComponent,
    RevisarPresentacionComponent,
    FilterComponent,
    ResumenComponent,
    ResumenDetalleComponent,
    ResumenHorasComponent,
    AsistenciaComponent,
    GraficosComponent,
    UploadResultadoHisopadoComponent
  ],
  imports: [
    SharedModule,
    LiquidacionesRoutingModule,
    NgxGalleryModule,
    CurrencyMaskModule,
    ChartsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  exports: [
    LiquidacionesComponent
  ],
  providers: [
    LiquidacionesService,
    PacientesCovidService
  ],
})
export class LiquidacionesModule { }
