// import interface Liquidaciones;
// import interface LiquidacionesClean;
import { Liquidaciones } from './liquidaciones';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';

export interface LiquidacionesRechazado extends Liquidaciones {
  motivoRechazo: string;
}

// export interface LiquidacionesRechazadoForExcel extends LiquidacionesClean {
//   Motivo_Rechazo: string;
// }

export class LiquidacionesRechazadoForExcel extends ExportMatTableToXlxs {

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

  transform(base: LiquidacionesRechazado): LiquidacionesRechazadoForExcel {
      const forExcel = new LiquidacionesRechazadoForExcel();
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
