
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OldPwdValidators } from '@app/modules/shared/validators/old-pwd.validators';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent {
  form1: FormGroup;
  isDontMatch  = false;

  constructor(fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService) {
    this.form1 = fb.group({
      'oldPwd': ['', Validators.required],
      'newPwd': ['', Validators.required],
      'confirmPwd': ['', Validators.required]
    }, {
      validator: OldPwdValidators.matchPwds
    });
  }

  get oldPwd() {
    return this.form1.get('oldPwd');
  }

   get newPwd() {
    return this.form1.get('newPwd');
  }

  get confirmPwd() {
    return this.form1.get('confirmPwd');
  }

  onChangePasswordClick() {
    if (this.form1.valid) {
      this.isDontMatch = false;
      this.authenticationService.changePassword(this.authenticationService.currentUser.id, this.oldPwd.value, this.newPwd.value)
      .subscribe(
        data => {
          this.toastrService.success('Contraseña cambiada con éxito');
        },
        error => {
          throw error;
        });
      } else {
        this.isDontMatch = true;
      }
  }
}
