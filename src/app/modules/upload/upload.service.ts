import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { AppConfig } from '../../configs/app.config';

@Injectable()
export class UploadService {
  entidad: string;
  idFirstEntidad: string;
  idSecondEntidad: string;
  currentNumberOfFiles: number;
  url: string;

  constructor(private http: HttpClient) {
    this.url = AppConfig.endpoints.api + 'Upload';
  }

  public upload(files: Set<File>): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};
    console.log(`Values upload entidad = ${this.entidad},
                              idFirstEntidad = ${this.idFirstEntidad},
                              idSecondEntidad = ${this.idSecondEntidad}`);
    let nroFile: number = this.currentNumberOfFiles;

    files.forEach(file => {

      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.set('entidad', this.entidad);
      formData.set('idFirstEntidad', this.idFirstEntidad);
      formData.set('idSecondEntidad', this.idSecondEntidad);
      formData.set('nroFile', nroFile.toString());

      formData.append(file.name, file);

      nroFile++;
      // const req = new HttpRequest('POST', this.url, formData);
      // // create a http-post request and pass the form
      // // tell it to report the upload progress
      const req = new HttpRequest('POST', this.url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates

      // const startTime = new Date().getTime();
      this.http.request(req).subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
