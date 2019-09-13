import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  constructor(
    public toastrService: ToastrService,
    private zone: NgZone) { }

  showSuccess(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.toastrService.success(message, '', { enableHtml: true });
    });
  }

  showError(message: string): void {
    this.zone.run(() => {
      this.toastrService.error(message, '', { enableHtml: true });
    });
  }
}
