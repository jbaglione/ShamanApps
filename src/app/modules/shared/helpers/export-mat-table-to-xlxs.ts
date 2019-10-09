export class ExportMatTableToXlxs {
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    const result: ExportMatTableToXlxs[] = [];
    if (!arrayBase || arrayBase.length === 0) {
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
