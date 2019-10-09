import { Component, OnInit } from '@angular/core';
import { Usuario } from '@app/modules/security/models/usuario.model';
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
