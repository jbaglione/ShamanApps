import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from '@app/modules/shared/shared.module';
import { SecurityRoutingModule } from '@app/modules/security/security-routing.module';
import { DialogForgotPasswordComponent } from './components/dialog-forgot-password/dialog-forgot-password.component';
import { DialogRegisterComponent } from './components/dialog-register/dialog-register.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    LoginComponent,
    DialogForgotPasswordComponent,
    DialogRegisterComponent
  ],
  imports: [
    SharedModule,
    SecurityRoutingModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  entryComponents: [DialogForgotPasswordComponent, DialogRegisterComponent]
})
export class SecurityModule {}
