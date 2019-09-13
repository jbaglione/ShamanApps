import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '@app/modules/security/models/usuario.model';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { UserService } from '@app/services/user.service';
import { first } from 'rxjs/operators';
import { PercentPipe } from '@angular/common';
import { SidenavService } from '@app/modules/core/services/sidenav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  usuarios: Usuario[] = [];
  site: string;
  userToken: string;
  constructor(
    private sidenavService: SidenavService
  ) { }

  ngOnInit() {
    this.sidenavService.open();
  }
}
