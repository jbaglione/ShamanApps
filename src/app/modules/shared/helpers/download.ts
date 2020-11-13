import { CommonService } from '@app/modules/shared/services/common.service';
import { forkJoin } from 'rxjs';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Output, EventEmitter, Directive } from '@angular/core';
import { Listable } from '@app/models/listable.model';
import { DescUrl } from '@app/models/DescUrl';

@Directive()
export class DownloadHelper {

  @Output() static setIsLoadingEvent = new EventEmitter<boolean>();

  // static downloadAllInZip(allFilesUrl: string[], filename: string, commonService: CommonService) {
  //   forkJoin(commonService.createGetRequets(allFilesUrl)).subscribe(res => {
  //     const zip = new JSZip();
  //     let fileName: String;

  //     res.forEach((f, i) => {
  //       if (allFilesUrl[i].includes('\\')) {
  //         fileName = allFilesUrl[i].substring(allFilesUrl[i].lastIndexOf('\\') + 1);
  //       } else {
  //         fileName = allFilesUrl[i].substring(allFilesUrl[i].lastIndexOf('/') + 1);
  //       }
  //       zip.file(`${fileName}`, f);
  //     });

  //     zip
  //       .generateAsync({ type: 'blob' })
  //       .then(blob => saveAs(blob, filename));
  //   });
  // }

  static downloadAllInZip(allFilesUrl: string[], filename: string, commonService: CommonService, dialog: MatDialog) {

    let fileName: String;
    const zip = new JSZip();

    let indice = 0;
    let errors = '';

    allFilesUrl.forEach(async url => {
      let file;
      try {
        file = await commonService.createOneGetRequets(url).toPromise();
        fileName = commonService.getFileName(url);

        zip.file(`${fileName}`, file);
        indice++;
      } catch (ex) {
        try {
          file = await commonService.createOneGetRequets(url).toPromise();
          fileName = commonService.getFileName(url);
          zip.file(`${fileName}`, file);
          indice++;
        } catch (ex) {
          errors += '&nbsp&nbsp' + commonService.getFileName(url) + ', <br />';
          indice++;
        }
      }
      if (indice == allFilesUrl.length) {
        this.setIsLoadingEvent.emit(false);
        let pos = errors.lastIndexOf(', ');
        errors = errors.substring(0, pos) + '.' + errors.substring(pos + 1);

        dialog.open(DialogComponent, {
          width: '350px',
          data: {
            title: 'Advertencia', content: '<p>Ocurrio un error al obtener los siguientes archivos: <br />' + errors + ' ¿Desea continuar?</p>',
            yesText: 'Continuar descarga', noText: 'Cancelar'
          }
        }).afterClosed().subscribe(resultDialog => {
          if (resultDialog) {
            zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, filename));
          }
        });
        return true;
      }
    });
    return true;
  }

  static downloadAllInZipV2(
    allFilesUrl: DescUrl[],
    filename: string,
    commonService: CommonService,
    dialog: MatDialog,
    messageError: string) {

    let fileName: String;
    const zip = new JSZip();

    let indice = 0;
    let errors = '';

    allFilesUrl.forEach(async item => {
      let file;
      try {
        file = await commonService.createOneGetRequets(item.url).toPromise();
        fileName = commonService.getFileName(item.url);
        zip.file(`${fileName}`, file);
        indice++;
      } catch (ex) {
        errors += '&nbsp&nbsp' + item.descripcion + ', <br />';
        indice++;
      }
      if (indice == allFilesUrl.length) {
        this.setIsLoadingEvent.emit(false);

        if (errors && messageError != '') {
          let pos = errors.lastIndexOf(', ');
          errors = errors.substring(0, pos) + '.' + errors.substring(pos + 1);

          dialog.open(DialogComponent, {
            width: '350px',
            data: {
              title: 'Advertencia', content: '<p>' + messageError + '<br />' + errors + '</p>',
              yesText: 'OK', noText: ''
            }
          }).afterClosed().subscribe(resultDialog => {
            zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, filename));
          });
        } else {
          zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, filename));
        }
      }
    });
    return true;
  }
}
