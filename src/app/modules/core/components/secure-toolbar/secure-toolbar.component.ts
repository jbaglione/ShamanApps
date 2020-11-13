import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secure-toolbar',
  templateUrl: './secure-toolbar.component.html',
  styleUrls: ['./secure-toolbar.component.scss']
})

export class SecureToolbarComponent implements OnInit {
  @Output() menuOutput = new EventEmitter<void>();
  @Output() messagesOutput = new EventEmitter<void>();
  @Output() notificationsOutput = new EventEmitter<void>();
  @Output() logoutOutput = new EventEmitter<void>();

  @Input() title = '';
  @Input() userName = '';
  @Input() cantidadMensajesPendientes = 0;
  @Input() cantidadAlertasPendientes = 0;
  @Input() isVisible = true;

  constructor(public mediaObserver: MediaObserver,
              private router: Router) { }

  ngOnInit() { }

  menu_click() {
    this.menuOutput.emit();
  }

  messages_click() {
    this.messagesOutput.emit();
  }

  notifications_click() {
    this.notificationsOutput.emit();
  }

  logout_click() {
    this.logoutOutput.emit();
  }

  configuracion_click() {
    this.router.navigate(['configuracion']);
  }

}


