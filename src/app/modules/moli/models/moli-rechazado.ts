// import interface Moli;
// import interface MoliClean;
import { Moli } from './moli';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';

export interface MoliRechazado extends Moli {
  motivoRechazo: string;
}

// export interface MoliRechazadoForExcel extends MoliClean {
//   Motivo_Rechazo: string;
// }

export class MoliRechazadoForExcel extends ExportMatTableToXlxs {

  Fecha_Incidente: string;
  Inc: string;
  Llamada: Date | string;
  Nro_Afiliado: string;
  Paciente: string;
  Domicilio: string;
  Localidad: string;
  Sintoma: string;
  Grado: string;

  Motivo_Rechazo: string;

  transform(base: MoliRechazado): MoliRechazadoForExcel {
      const forExcel = new MoliRechazadoForExcel();
      if (base != null) {

      forExcel.Fecha_Incidente = base.fecIncidente;
      forExcel.Inc = base.nroIncidente;
      forExcel.Llamada = base.llamada;
      forExcel.Nro_Afiliado = base.integranteId;
      forExcel.Paciente = base.nombre;
      forExcel.Domicilio = base.domicilio;
      forExcel.Localidad = base.localidad;
      forExcel.Sintoma = base.sintoma;
      forExcel.Grado = base.grado;
      forExcel.Motivo_Rechazo = base.motivoRechazo;
    }
    return forExcel;
  }
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    return super.arrayBaseToExcel(arrayBase);
  }
}
