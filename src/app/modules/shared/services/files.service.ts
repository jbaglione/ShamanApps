import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '@app/modules/shared/services/common.service';
import { ExportMatTableToXlxs } from '../helpers/export-mat-table-to-xlxs';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DateHelper } from '../helpers/DateHelper';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FileService {

  static EXCEL_TYPE: FileType = { contentType: 'application/vnd.ms-excel', extension: '.xls', replace: 'data:application/vnd.ms-excel;base64,' };
  static EXCEL_NEW_TYPE: FileType = { contentType: 'application/vnd.ms-excel', extension: '.xlsx', replace: 'data:application/vnd.ms-excel;base64,' };
  static PDF_TYPE: FileType = { contentType: 'application/pdf', extension: '.pdf', replace: 'data:application/pdf;base64,' };

  constructor(private commonService: CommonService
  ) {
  }

  public exportMatTable(exportable: ExportMatTableToXlxs, mtDataSource: MatTableDataSource<any>, filename: string, share = false) {
    const arrayExport = exportable.arrayBaseToExcel(
      mtDataSource.sortData(mtDataSource.filteredData, mtDataSource.sort)
    );
    if (!arrayExport || arrayExport.length === 0) {
      const accion = share ? 'compartir' : 'guardar';
      this.commonService.showSnackBar('¡No hay registros para ' + accion + '!');
      return;
    }
    this.exportExcel(arrayExport, filename, share);
  }

  private exportExcel(json: any[], filename: string, share: boolean): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const workbook: XLSX.WorkBook = {
      Sheets: { data: this.GetWorkSheetAutofitColumns(json) },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveBuffer(excelBuffer, filename, FileService.EXCEL_NEW_TYPE);
  }

  GetWorkSheetAutofitColumns(json: any[]): XLSX.WorkSheet {
        let objectMaxLength = [];
        for (let i = 0; i < json.length; i++) {
          let value = <any>Object.values(json[i]);
          for (let j = 0; j < value?.length; j++) {
            if (typeof value[j] == 'number') {
              objectMaxLength[j] = 10; // OJO con esto
            } else {
              objectMaxLength[j] =
                objectMaxLength[j] >= value[j]?.length
                  ? objectMaxLength[j]
                  : value[j]?.length;
            }
          }
        }
        console.log(objectMaxLength);

        let wscols = [
          { width: objectMaxLength[0] + 1 },
          { width: objectMaxLength[1] + 1 },
          { width: objectMaxLength[2] + 1 },
          { width: objectMaxLength[3] + 1 },
          { width: objectMaxLength[4] + 1 },
          { width: objectMaxLength[5] + 1 },
          { width: objectMaxLength[6] + 1 },
          { width: objectMaxLength[7] + 1 },
          { width: objectMaxLength[8] + 1 },
          { width: objectMaxLength[9] + 1 },
          { width: objectMaxLength[10] + 1 },
          { width: objectMaxLength[11] + 1 },
          { width: objectMaxLength[12] + 1 },
          { width: objectMaxLength[13] + 1 },
          { width: objectMaxLength[14] + 1 },
          { width: objectMaxLength[15] + 1 },
          { width: objectMaxLength[16] + 1 },
          { width: objectMaxLength[17] + 1 },
          { width: objectMaxLength[18] + 1 },
          { width: objectMaxLength[19] + 1}
        ];

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        worksheet['!cols'] = wscols;
        return worksheet;
  }

  public saveBuffer(buffer: any, filename: string, fileType: FileType, isFullFileName = false): void {
    const fullFilename = isFullFileName ? filename : filename + '_' + DateHelper.getFormattedTime() + fileType.extension;
    const data: Blob = new Blob([buffer], { type: fileType.contentType });

    FileSaver.saveAs(data, fullFilename);
  }


  public base64ToBlob(b64Data, contentType = '', sliceSize = 512): Blob {
    b64Data = b64Data.replace(/\s/g, ''); // IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }


  // Extras
  public getFileNameFromHeader(headers: HttpHeaders) {
    let fileName = '';
    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition) {
      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = fileNameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
        fileName = fileName.replace('=?utf-8?B?', '').split('?')[0];
        console.log(fileName);
        try {
          fileName = this.b64DecodeUnicode(fileName);
        } catch (error) {
          console.error(error);
        }
      }
    }
    return fileName;
  }

  public b64DecodeUnicode(str: string): string {
    if (window && 'atob' in window && 'decodeURIComponent' in window) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } else {
        console.warn('b64DecodeUnicode requirements: window.atob and window.decodeURIComponent functions');
        return null;
    }
  }
}


export interface FileType {
  contentType: string;
  replace: string;
  extension: string;
}
