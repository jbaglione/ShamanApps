import { Component, Input, OnInit  } from '@angular/core';

import { AdComponent } from './ad.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '@app/services/common.service';

@Component({
  template: `
  <form [formGroup]='inputNumberForm'>
  <mat-form-field class="ml-5 mr-5 very-short-form-field">
    <input matInput placeholder="{{data.placeholderInput}}" type="number" class="form-control" formControlName="numberControl">
    <mat-error>{{data.errorInput}}</mat-error>
  </mat-form-field>
  <ng-container *ngIf="data.conObservacion">
    <mat-form-field class="ml-5 mr-5 very-short-form-field">
      <input matInput placeholder="{{data.placeholderObservacion}}" type="text" class="form-control" formControlName="observacionControl">
      <mat-error>{{data.errorObservacion}}</mat-error>
    </mat-form-field>
  </ng-container>
  </form>
 `
})
export class InputNumberComponent implements AdComponent, OnInit {
  @Input() data: any;
  inputNumberForm: FormGroup;

  ngOnInit(): void {
    this.inputNumberForm = new FormGroup({
      numberControl: new FormControl({ value: this.data.startValue, disabled: this.data.disabled},
                                      [
                                        Validators.minLength(this.data.minLength),
                                        Validators.maxLength(this.data.maxLength),
                                        Validators.min(this.data.min),
                                        Validators.max(this.data.max),
                                        Validators.required,
                                      ]),
      observacionControl: new FormControl({ value: this.data.startValueObservacion, disabled: this.data.disabledObservacion},
                                          [
                                            Validators.minLength(this.data.minLengthObservacion),
                                            Validators.maxLength(this.data.maxLengthObservacion),
                                            Validators.required,
                                          ])
      });

    //#region comments
    // console.log(this.data);
    //  this.rateControl = new FormControl('', [Validators.max(this.data.max)]);
    //  console.log(this.rateControl.value);
    // this.numberControl = new FormControl({ value: this.data.startValue, disabled: this.data.disabled},
    //                                       [
    //                                         Validators.minLength(this.data.minLength),
    //                                         Validators.maxLength(this.data.maxLength),
    //                                         Validators.min(this.data.min),
    //                                         Validators.max(this.data.max),
    //                                         Validators.required,
    //                                         Validators.pattern(this.data.pattern)
    //                                       ]);
    // this.observacionControl = new FormControl({ value: this.data.startValueObservacion, disabled: this.data.disabledObservacion},
    //   [
    //     Validators.minLength(this.data.minLengthObservacion),
    //     Validators.maxLength(this.data.maxLengthObservacion),
    //     Validators.required,
    //     Validators.pattern(this.data.max)
    //   ]);
    // [ Validators.maxLength(this.data.max),
    //   Validators.min(this.data.max),
    //   Validators.max(this.data.max),
    //   Validators.required(this.data.max),
    //   Validators.requiredTrue(this.data.max),
    //   Validators.email(this.data.max),
    //   Validators.minLength(this.data.max),
    //   Validators.maxLength(this.data.max),
    //   Validators.pattern(this.data.max),
    //   Validators.nullValidator(this.data.max),
    //   Validators.compose(this.data.max),
    //   Validators.composeAsync(this.data.max)]);
    //#endregion
    }
}



