import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { ExtranetV1RoutingModule } from './extranet-v1-routing.module';
import { IndexComponent } from './pages/index/index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    SharedModule,
    ExtranetV1RoutingModule
  ],
  exports: [IndexComponent],
})
export class ExtranetV1Module { }
