import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MensajeItem } from './../../models/mensaje-item.model';

@Component({
  selector: 'app-mensajes-list',
  templateUrl: './mensajes-list.component.html',
  styleUrls: ['./mensajes-list.component.css']
})
export class MensajesListComponent implements OnInit {
  @Input() mensajesItems: MensajeItem [];
  @Input() cargandoMensajes: boolean;
  @Output() mensajetItemOutput = new EventEmitter<MensajeItem>();
  mensajeItemSelected: MensajeItem;

  constructor() { }

  ngOnInit() {
  }

  seleccionarMensajeItem(mensajeItem: MensajeItem) {
    this.mensajeItemSelected = mensajeItem;
    this.mensajetItemOutput.emit(mensajeItem);
  }
}
