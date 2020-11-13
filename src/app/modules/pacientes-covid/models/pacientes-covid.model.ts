import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';
import { DatePipe } from '@angular/common';

export interface PacienteCovid {
    id: number;
    fecIncidente: Date;
    nroIncidente: string;
    clienteId: string;
    nroAfiliado: string;
    paciente: string;
    fecNacimiento: Date;
    edad: string;
    nroDocumento: number;
    domicilio: string;
    localidad: string;
    telefono: string;
    entreCalle1: string;
    entreCalle2: string;
    sintoma: string;
    estado: string;
    doctor: string;
    observaciones: string;
}

export class PacienteCovidForExcel extends ExportMatTableToXlxs {

  Fecha_Inc: Date | string;
  Nro_Inc: string;
  Cliente: string;
  Nro_Afiliado: string;
  Paciente: string;
  Fecha_Nacimiento: Date | string;
  Edad: string;
  NroDocumento: number;
  Domicilio: string;
  Localidad: string;
  Telefono: string;
  Entre_Calle_1: string;
  Entre_Calle_2: string;
  Sintoma: string;
  Estado: string;
  Doctor: string;
  Observaciones: string;
  transform(base: PacienteCovid): PacienteCovidForExcel {
    const forExcel = new PacienteCovidForExcel();
    if (base != null) {
      const datePipe = new DatePipe('en-US'); // es-AR';
      forExcel.Fecha_Inc = datePipe.transform(base.fecIncidente, 'dd/MM/yyyy');
      forExcel.Nro_Inc = base.nroIncidente;
      forExcel.Cliente = base.clienteId;
      forExcel.Nro_Afiliado = base.nroAfiliado;
      forExcel.Paciente = base.paciente;
      forExcel.Fecha_Nacimiento = datePipe.transform(base.fecNacimiento, 'dd/MM/yyyy');
      forExcel.Edad = base.edad;
      forExcel.NroDocumento = base.nroDocumento;
      forExcel.Domicilio = base.domicilio;
      forExcel.Localidad = base.localidad;
      forExcel.Telefono = base.telefono;
      forExcel.Entre_Calle_1 = base.entreCalle1;
      forExcel.Entre_Calle_2 = base.entreCalle2;
      forExcel.Sintoma = base.sintoma;
      forExcel.Doctor = base.doctor;
      forExcel.Observaciones = base.observaciones;
    }
    return forExcel;
  }
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    return super.arrayBaseToExcel(arrayBase);
  }
}
