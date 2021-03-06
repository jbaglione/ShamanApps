import { Component, OnInit } from '@angular/core';
import { AppConfig } from '@app/configs/app.config';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})

export class PublicLayoutComponent implements OnInit {
  currentDate: string;
  anio: number;
  version = AppConfig.version;

  constructor() {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.anio = new Date().getFullYear();
  }
}
