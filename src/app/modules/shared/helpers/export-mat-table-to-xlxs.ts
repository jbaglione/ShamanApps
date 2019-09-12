import { tsXLXS } from 'ts-xlsx-export';
import { MatTableDataSource } from '@angular/material';
import { CommonService } from '@app/services/common.service';

export class ExportMatTableToXlxs {
  static export(exportable: ExportMatTableToXlxs, mtDataSource: MatTableDataSource<any>, nameFile: string, commonService: CommonService) {
    const arrayExport = exportable.arrayBaseToExcel(
      mtDataSource.sortData(mtDataSource.filteredData, mtDataSource.sort)
    );
    if (!arrayExport || arrayExport.length == 0) {
      commonService.showSnackBar('¡No hay registros para exportar!');
      return;
    }
    tsXLXS().exportAsExcelFile(arrayExport).saveAsExcelFile(nameFile);
  }

  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    const result: ExportMatTableToXlxs[] = [];
    if (!arrayBase || arrayBase.length == 0) {
      return result;
    }
    const arrayLength = arrayBase.length;
    for (let i = 0; i <= arrayLength; i++) {
      const itemBase = arrayBase[i];
      if (itemBase) {
        result.push(this.transform(itemBase));
      }
    }
    return result;
  }
  transform(a: any): any {}
}
