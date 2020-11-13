import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxComponent } from './pages/inbox/inbox.component';
import { AlertasComponent } from './pages/alertas/alertas.component';
import { MensajeMobileComponent } from './pages/mensaje-mobile/mensaje-mobile.component';


const routes: Routes = [
  {path: 'mensajes', component: InboxComponent},
  {path: 'mensaje-mobile/:id', component: MensajeMobileComponent},
  {path: 'alertas', component: AlertasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensajeriaRoutingModule { }
