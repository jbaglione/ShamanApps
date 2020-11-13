import { Component, OnInit, Input } from '@angular/core';
import { Mensaje } from '../../models/mensaje.model';
import { MensajesService } from '../../services/mensajes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mensaje-content',
  templateUrl: './mensaje-content.component.html',
  styleUrls: ['./mensaje-content.component.css']
})
export class MensajeContentComponent implements OnInit {
  @Input() mensaje: Mensaje;
  cantidadMensajes$: Observable<number>;

  constructor(
    private mensajesService: MensajesService
  ) { }

  ngOnInit() {
   this.cantidadMensajes$ = this.mensajesService.currentCantMensjes;
  }

}
