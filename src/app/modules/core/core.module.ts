import { MensajeriaModule } from './../mensajeria/mensajeria.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { SecurityModule } from '@app/modules/security/security.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { SecureLayoutComponent } from './layouts/secure-layout/secure-layout.component';
import { GlobalErrorHandler } from './helpers/global-error-handler';
import { SecureToolbarComponent } from './components/secure-toolbar/secure-toolbar.component';
import { ScrollDirectionDirective } from './helpers/scroll-direction.directive';

@NgModule({
  declarations: [
    NotFoundComponent,
    PublicLayoutComponent,
    SecureLayoutComponent,
    SecureToolbarComponent,
    ScrollDirectionDirective,
  ],
  imports: [
    SharedModule,
    SecurityModule,
    MensajeriaModule
  ],
  providers: [
     {provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})

export class CoreModule {
}
