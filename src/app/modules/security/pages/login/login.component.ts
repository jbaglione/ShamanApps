import { DialogRegisterComponent } from './../../components/dialog-register/dialog-register.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { DialogForgotPasswordComponent } from '../../components/dialog-forgot-password/dialog-forgot-password.component';
import { first } from 'rxjs/operators';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private progressBarService: ProgressBarService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.progressBarService.activarProgressBar();

    this.authenticationService
      .login(this.f.username.value, this.f.password.value )
      .pipe(first())
      .subscribe(
        usuario => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          this.progressBarService.desactivarProgressBar();
          throw error;
        }
      );
  }

  forgot() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    const forgotDialogRef = this.dialog.open(DialogForgotPasswordComponent, dialogConfig);
  }

  register() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    const rgisterDialogRef = this.dialog.open(DialogRegisterComponent, dialogConfig);
  }
}
