import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mensaje-mobile-toolbar',
  templateUrl: './mensaje-mobile-toolbar.component.html',
  styleUrls: ['./mensaje-mobile-toolbar.component.scss']
})
export class MensajeMobileToolbarComponent implements OnInit {
  @Output() backOutput = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  back_click() {
    this.backOutput.emit();
  }
}
