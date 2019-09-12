// import interface Moli;
// import interface MoliClean;
import { Moli } from './moli';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';

export interface MoliRealizado extends Moli {
  arribo: Date | string;
  arriboDate: Date | string;
  diagnostico: string;
  deriva: string;
  final: string;
  finalDate: Date | string;
  // nroInterno: string;
}

export class MoliRealizadoForExcel extends ExportMatTableToXlxs {
  Fecha_Incidente: string;
  Inc: string;
  Llamada: Date | string;
  Nro_Afiliado: string;
  Paciente: string;
  Domicilio: string;
  Localidad: string;
  Sintoma: string;
  Grado: string;

  Arribo: Date | string;
  Diagnostico: string;
  Deriva: string;
  Final: string;
  // nroInterno: string;
  transform(base: MoliRealizado): MoliRealizadoForExcel {
    const forExcel = new MoliRealizadoForExcel();
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
      forExcel.Arribo = base.arribo;
      forExcel.Diagnostico = base.diagnostico;
      forExcel.Deriva = base.deriva;
      forExcel.Final = base.final;
    }
    return forExcel;
  }
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    return super.arrayBaseToExcel(arrayBase);
  }
}
