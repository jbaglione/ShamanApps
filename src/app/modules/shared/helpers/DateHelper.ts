
export class DateHelper {
  static getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    // JavaScript months are 0-based.
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y.toString() + m.toString().padStart(2, '0') + d.toString().padStart(2, '0') + '_' + h + '-' + mi + '-' + s;
  }

  static DateDiff(dt2: Date, dt1: Date) {
     let diff = (dt2.getTime() - dt1.getTime()) / 1000;
     diff /= (60 * 60);
     return Math.abs(Math.round(diff));
  }

  static dateToTimeStamp(pDate: Date | string) {
    const date = new Date(pDate);
    const y = date.getFullYear();
    // JavaScript months are 0-based.
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();
    return y.toString() + '-' + m.toString().padStart(2, '0') + '-' + d.toString().padStart(2, '0') + ' ' + h.toString().padStart(2, '0') + ':' + mi.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
  }

  static dateToAnsi(pDate: Date | string) {
    const date = new Date(pDate);
    const y = date.getFullYear();
    // JavaScript months are 0-based.
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();
    return y.toString() + m.toString().padStart(2, '0') + d.toString().padStart(2, '0');
  }

  static ansiToDate(pDateString: string): Date {
    if (pDateString.length == 8) {
      let year = this.parseIntLocal(pDateString.slice(0, 4));
      let month = this.parseIntLocal(pDateString.slice(4, 6));
      let day = this.parseIntLocal(pDateString.slice(6, 8));
      return new Date(year, month - 1, day);
    } else {
      return null; // New Date();
    }
  }

  static calculateDiffDays(date1: Date, date2: Date) {
    let date1Utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    let date2Utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor(( date1Utc - date2Utc ) / (1000 * 60 * 60 * 24));
  }

  static parseIntLocal(value): number {
    if (!isNaN(parseInt(value))) {
      return parseInt(value);
    } else {
      return 0;
    }
  }

  static prevMonth(date: Date, restMonth = 1): Date {
    const thisMonth = date.getMonth();
    date.setMonth(thisMonth - restMonth);
    if ((date.getMonth() !== thisMonth - restMonth) && (date.getMonth() !== 11 || (thisMonth === 11 && date.getDate() === 1))) {
      date.setDate(0);
    }
    return date;
  }
}
