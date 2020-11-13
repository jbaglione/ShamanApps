export interface Asistencia {
  fecMovimiento: string | Date;
  diaSemana: string;
  pacFecHorInicio: string | Date;
  pacFecHorFinal: string | Date;
  horasPactadas: number;
  relFecHorInicio: string | Date;
  minTarde: number;
  tarde: string;
  relFecHorFinal: string | Date;
  minAnticipado: number;
  anticipado: string;
  motivoDescuento: string;
  virEvlDescontable: number;
  virTpoDescontable: string;
  horasTrabajadas: number;
}
