import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-forgot-password',
  templateUrl: './dialog-forgot-password.component.html',
  styleUrls: ['./dialog-forgot-password.component.css']
})
export class DialogForgotPasswordComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<DialogForgotPasswordComponent>,
    private toastrService: ToastrService) { }

  onSendClick(): void {
    this.authenticationService
      .forgotPassword(this.emailFormControl.value)
      .subscribe(
        usuario => {
          this.toastrService.info('Hemos enviado la nueva clave a su E-mail.');
          this.dialogRef.close();
        },
        error => {
          this.toastrService.error(error.error.detail);
        }
      );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
