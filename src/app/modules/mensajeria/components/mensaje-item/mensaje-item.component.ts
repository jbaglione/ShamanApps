import { Component, OnInit, Input } from '@angular/core';
import { MensajeItem } from '../../models/mensaje-item.model';

@Component({
  selector: 'app-mensaje-item',
  templateUrl: './mensaje-item.component.html',
  styleUrls: ['./mensaje-item.component.css']
})
export class MensajeItemComponent implements OnInit {
  @Input() mensajeItem: MensajeItem;

  constructor() { }

  ngOnInit() {
  }

}
