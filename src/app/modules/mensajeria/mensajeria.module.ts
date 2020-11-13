import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedModule } from '@app/modules/shared/shared.module';
import { MensajeriaRoutingModule } from './mensajeria-routing.module';
import { InboxComponent } from './pages/inbox/inbox.component';
import { MensajesListComponent } from './components/mensajes-list/mensajes-list.component';
import { MensajeItemComponent } from './components/mensaje-item/mensaje-item.component';
import { MensajeContentComponent } from './components/mensaje-content/mensaje-content.component';
import { MensajesToolbarComponent } from './components/mensajes-toolbar/mensajes-toolbar.component';
import { AlertasComponent } from './pages/alertas/alertas.component';
import { MensajeMobileComponent } from './pages/mensaje-mobile/mensaje-mobile.component';
import { MensajeMobileToolbarComponent } from './components/mensaje-mobile-toolbar/mensaje-mobile-toolbar.component';


@NgModule({
  declarations: [
    InboxComponent,
    MensajesListComponent,
    MensajeItemComponent,
    MensajeContentComponent,
    MensajesToolbarComponent,
    AlertasComponent,
    MensajeMobileComponent,
    MensajeMobileToolbarComponent
  ],
  imports: [
    SharedModule,
    MensajeriaRoutingModule
  ],
  exports: [InboxComponent, AlertasComponent],
  providers: [
    DatePipe
  ]
})
export class MensajeriaModule { }
