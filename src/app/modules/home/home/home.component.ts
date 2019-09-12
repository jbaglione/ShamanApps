import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '@app/modules/security/models/usuario.model';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { UserService } from '@app/services/user.service';
import { first } from 'rxjs/operators';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  usuarios: Usuario[] = [];
  site: string;
  userToken: string;
  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private router: Router) {
                let a =1;
              //   activatedRoute.params.subscribe(params => {
              //     this.site = params['site'];
              //     this.userToken = params['token'];

              //     // Works as login
              //     this.authenticationService.loginByToken(this.userToken).pipe(first())
              //     .subscribe(
              //         data => {
              //           this.router.navigate([this.site]); // ['bitacoras']
              //         },
              //         error => {
              //           console.log(error);
              //           this.authenticationService.logout();
              //           // tis._router.navigate(['Sesion vencida']);
              //         });
              // });
              }

  ngOnInit() {
    //
    // this.userService.getAll().pipe(first()).subscribe(users => {
    //     this.usuario = users;
    // });
}

}
