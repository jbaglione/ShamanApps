export class HorasMinutosHelper {
  static getInHours(totalMinutes: number): string {
    let hours: number = Math.floor(totalMinutes / 60);
    let minutes: number = totalMinutes % 60;

    // Anteponiendo un 0 a los minutos si son menos de 10
    let hoursS = hours < 10 ? '0' + hours : hours;
    // Anteponiendo un 0 a los segundos si son menos de 10
    let minutesS = minutes < 10 ? '0' + minutes : minutes;

    let result = hoursS + '.' + minutesS;  // 161:30
    return (result);
  }
}
