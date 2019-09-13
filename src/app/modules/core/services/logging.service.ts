import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfig } from '@app/configs/app.config';
import { AuthenticationService } from '@app/modules/security/authentication.service';

declare let ClientIP: any;

@Injectable({
    providedIn: 'root'
})

export class LoggingService {
  private messageToSend;

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) { }

  logError(message: string, stack: string, apiEndpoint: string, isServerError: boolean) {
    let currentUser = this.authenticationService.currentUserValue;
    let that = this;

    this.httpClient.get(AppConfig.proxyCORSUrl  + AppConfig.getApiURL).subscribe(data => {
      that.messageToSend = {
        channel: '#extranet',
        text: ((isServerError) ? 'SERVER' :  'CLIENT') + ' ERROR- ' + message,
        attachments: [
          {
            author_name: (currentUser != null) ? currentUser.username : 'Anonimous',
            color: 'danger',
            fields: [
              { title: 'Email', value:  (currentUser != null) ? currentUser.email : '-', short: false},
              { title: 'From', value: window.location.href, short: false},
              { title: 'Private IP', value: ClientIP, short: true},
              { title: 'Public IP', value: data['ip'], short: true},
              { title: 'API Endpoint', value: apiEndpoint, short: false},
              { title: 'Trace', value: stack, short: false}
            ]
          }
        ]
      };

      const options = {
        headers: new HttpHeaders(
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
      };

      that.httpClient.post(AppConfig.proxyCORSUrl  + AppConfig.loggingWebHook,  JSON.stringify(that.messageToSend), options).subscribe();
    });
  }
}
