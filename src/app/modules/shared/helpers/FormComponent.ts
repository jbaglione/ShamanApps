import { FormGroup } from '@angular/forms';

export class FormComponent  {
  formGroup: FormGroup;

    get f() {
      return this.formGroup.controls;
    }
}
