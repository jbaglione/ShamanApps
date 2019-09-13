import { SharedModule } from '@app/modules/shared/shared.module';
import { NgModule } from '@angular/core';
import { DynamicsComponent } from './dynamics.component';
import { HeroJobAdComponent } from './hero-job-ad.component';
import { AdBannerComponent } from './ad-banner.component';
import { HeroProfileComponent } from './hero-profile.component';
import { InputNumberComponent } from './input-number.component';
import { AdDirective } from './ad.directive';
import { AdService } from './ad.service';

@NgModule({
  imports: [ SharedModule ],
  providers: [AdService],
  declarations: [ DynamicsComponent,
                  InputNumberComponent,
                  AdBannerComponent,
                  HeroJobAdComponent,
                  HeroProfileComponent,
                  AdDirective ],
  entryComponents: [ InputNumberComponent, HeroJobAdComponent, HeroProfileComponent, DynamicsComponent],
  exports: [DynamicsComponent]
})
export class DynamicsModule {
  constructor() {}
}



