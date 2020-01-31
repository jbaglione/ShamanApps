
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
    return y.toString() + m.toString() + d.toString() + '_' + h + '-' + mi + '-' + s;
  }
  static dateDiff(dt2: Date, dt1: Date) {
   let diff = (dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60);
   return Math.abs(Math.round(diff));
  }
}
