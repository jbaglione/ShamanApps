import { ServicioImagen } from './servicio-imagen.model';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';
import { DatePipe } from '@angular/common';

export interface ComprobanteServicio {
  id: number;
  formatedFecha: Date | string;
  nroIncidente: string;
  conceptoId: string;
  nroInterno: string;
  iva: string;
  arba: string;
  agip: string;
  nroAfiliado: string;
  paciente: string;
  formatedPaciente: string;
  desde: string;
  hasta: string;
  kmt: number;
  tpoEspera: string;
  importeBase: number;
  recargos: number;
  importe: number;
  ordenesFiles: string;
  servicioImagenes: ServicioImagen[];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
}

export class ComprobanteServicioForExcel extends ExportMatTableToXlxs {

  Incidente: string;
  Fecha: string;
  Concepto: string;
  Nro_Interno: string;
  Iva: string;
  Arba: string;
  Agip: string;
  Nro_Afiliado: string;
  Paciente: string;
  Desde: string;
  Hasta: string;
  Kmt: number;
  Espera: string;
  Importe_Base: number;
  Recargos: number;
  Importe: number;

  transform(comprobanteServicio: ComprobanteServicio): ComprobanteServicioForExcel {
      const forExcel = new ComprobanteServicioForExcel();
      if (comprobanteServicio != null) {
        const datePipe = new DatePipe('en-US');//es-AR');
        forExcel.Incidente = comprobanteServicio.nroIncidente;
        forExcel.Fecha =  datePipe.transform(comprobanteServicio.formatedFecha, 'dd/MM/yyyy');
        forExcel.Concepto = comprobanteServicio.conceptoId;
        forExcel.Nro_Interno = comprobanteServicio.nroInterno;
        forExcel.Iva = comprobanteServicio.iva;
        forExcel.Arba = comprobanteServicio.arba;
        forExcel.Agip = comprobanteServicio.agip;
        forExcel.Nro_Afiliado = comprobanteServicio.nroAfiliado;
        forExcel.Paciente = comprobanteServicio.formatedPaciente;
        forExcel.Desde = comprobanteServicio.desde;
        forExcel.Hasta = comprobanteServicio.hasta;
        forExcel.Kmt = comprobanteServicio.kmt;
        forExcel.Espera = comprobanteServicio.tpoEspera;
        forExcel.Importe_Base = comprobanteServicio.importeBase;
        forExcel.Recargos = comprobanteServicio.recargos;
        forExcel.Importe = comprobanteServicio.importe;
    }
    return forExcel;
  }
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    return super.arrayBaseToExcel(arrayBase);
  }
}
