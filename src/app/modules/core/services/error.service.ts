import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../models/errorMessage.model';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    getClientMessage(error: Error): ErrorMessage {
        let errorMessage = new ErrorMessage();

        if (!navigator.onLine) {
          errorMessage.original = 'Sin conexión a internet';
          errorMessage.friendly = errorMessage.original;
          return errorMessage;
        }

        errorMessage.original = error.message ? error.message : error.toString();
        errorMessage.friendly = 'Hubo un inconveniente, intente mas tarde.';
        return errorMessage;
    }

    getClientStack(error: Error): string {
        return error.stack;
    }

    getServerMessage(error: HttpErrorResponse): ErrorMessage {
      let errorMessage: ErrorMessage = new ErrorMessage();

      if (error.error.status === 400) {
        for (const key in error.error.errors) {
          if (
            error.error.errors.hasOwnProperty(key) &&
            Array.isArray(error.error.errors[key])
          ) {
            error.error.errors[key].forEach(x => {
              errorMessage.original += '- ' + x + '<br/>';
            });
          }
        }
        errorMessage.friendly = errorMessage.original;
      } else if (error.status >= 401 && error.status < 500) {
        errorMessage.original = error.error.detail;
        errorMessage.friendly = errorMessage.original;
      } else {
        if (error.error.businessException) {
          errorMessage.original = error.error.title + '-' +  error.error.businessException;
          errorMessage.friendly = error.error.businessException;
        } else {
          errorMessage.original = error.error.title;
          errorMessage.friendly = 'Hubo un inconveniente, intente mas tarde.';
        }
      }
      return errorMessage;
    }

    getServerStack(error: HttpErrorResponse): string {
      return error.error.traceIdentifier;
    }
}
