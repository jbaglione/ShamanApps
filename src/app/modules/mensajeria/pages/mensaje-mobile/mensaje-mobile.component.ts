import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from '../../services/index';
import {  Mensaje } from '../../models/index';

@Component({
  selector: 'app-mensaje-mobile',
  templateUrl: './mensaje-mobile.component.html',
  styleUrls: ['./mensaje-mobile.component.scss']
})
export class MensajeMobileComponent implements OnInit {
  mensajeSelected: Mensaje;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private mensajeriaService: MensajesService,
  ) { }

  ngOnInit() {
    this.mensajeriaService
    .GetMensaje(this.activatedRoute.snapshot.params.id)
    .subscribe(data => {
      this.mensajeSelected = data;
    });
  }

  backPage() {
    this.router.navigate(['/mensajeria/mensajes']);
  }

}
