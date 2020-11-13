import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
  styleUrls: ['./google-button.component.css']
})

export class GoogleButtonComponent {
  @Input() title: string;
  @Input() text: string;
  @Input() type: string;
  @Output() click = new EventEmitter();
  @Output() blur = new EventEmitter();
  constructor() { }

  clickButton() {
    // this.click.emit(); //no hace falta
  }

  blurButton() {
    this.blur.emit();
  }
}
