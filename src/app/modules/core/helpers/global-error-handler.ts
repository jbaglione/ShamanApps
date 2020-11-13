import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../services/error.service';
import { LoggingService } from '../services/logging.service';
import { NotificationService } from '../services/notification.service';
import { ErrorMessage } from '../models/errorMessage.model';

@Injectable()

export class GlobalErrorHandler implements ErrorHandler {
    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector,
      private zone: NgZone) {}

  handleError(error: Error | HttpErrorResponse) {

    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationService);

    let message: ErrorMessage;
    let stackTrace: string;
    let apiEndpoint = '-';
    let isServerError = false;
    let error401 = false;

    if (error instanceof HttpErrorResponse) {
        // Server Error
        message = errorService.getServerMessage(error);
        stackTrace = errorService.getServerStack(error);
        apiEndpoint = error.error.apiEndpoint;
        isServerError = true;
        error401 = (error.status == 401);
    } else {
        // Client Error
        message = errorService.getClientMessage(error);
        stackTrace = errorService.getClientStack(error);
    }
    notifier.showError(message.friendly);

    if (!error401) {
      logger.logError(message.original, stackTrace, apiEndpoint, isServerError);
    }

    console.error(error);
  }

}
