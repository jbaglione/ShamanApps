import { Injectable } from '@angular/core';
import { HeroJobAdComponent } from './hero-job-ad.component';
import { HeroProfileComponent } from './hero-profile.component';
import { InputNumberComponent } from './input-number.component';
import { AdItem } from './ad-item';

const componentsMap = {
  InputNumberComponent,
  HeroProfileComponent
};
type ComponentName = keyof typeof componentsMap;

@Injectable()
export class AdService {
  componentsMap = {
    InputNumberComponent,
    HeroProfileComponent,
    HeroJobAdComponent
  };

convertStringToComponent<Name extends ComponentName>(name: Name): (typeof componentsMap)[Name] {
  return componentsMap[name];
}

  getAds() {
    return [
      // new AdItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'}),

      // new AdItem(HeroProfileComponent, {name: 'Dr IQ', bio: 'Smart as they come'}),

      // new AdItem(HeroJobAdComponent,   {headline: 'Hiring for several positions',
      //                                   body: 'Submit your resume today!'}),

      // new AdItem(HeroJobAdComponent,   {headline: 'Openings in all departments',
      //                                   body: 'Apply today'}),

      new AdItem(this.convertStringToComponent('InputNumberComponent'), {
                                        placeholderInput: 'Chapa y Pint.',
                                        startValue: 5,
                                        max: 15,
                                        min: 6,
                                        disabled: false,
                                        errorInput: 'El numero posee valores incorrectos',
                                        // Observacion
                                        conObservacion: true,
                                        placeholderObservacion: 'Observaciones',
                                        startValueObservacion: 'Escriba aqui sus observaciones',
                                        disabledObservacion: false,
                                        minLengthObservacion: 5,
                                        maxLengthObservacion: 20,
                                        errorObservacion: 'La observacion debe ser mayor a 5 caracteres'}),
        new AdItem(this.convertStringToComponent('InputNumberComponent'), {
                                          placeholderInput: 'Asientos.',
                                          startValue: 2,
                                          disabled: false,
                                          conObservacion: false}),
      // new AdItem(InputNumberComponent, {
      //                                     headline: 'Chapa y Pint.',
      //                                     startValue: 5,
      //                                     disabled: true,
      //                                     body: 'Apply today'}),
    ];
  }
}
