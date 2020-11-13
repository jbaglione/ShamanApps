import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';
import { OrdenImagen } from './orden-imagen.model';
import { NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { CurrencyPipe } from '@angular/common';

export class Incidentes {

id: string;
incidenteId: string;
fecIncidente: string;
realFecIncidente: Date | String;
nroIncidente: string;
iva: string;
iibb: string;
nombre: string;
localidadDesde: string;
localidadHasta: string;
kilometros: string;
retorno: string;
turno: string;
tpoEspera: string;
conceptoFacturacionId: string;
coPago: number;
deriva: string;
importe: number;
flgCapitado: number;
rem: string;
conf: string;
rev: string;
archivoOrden: string;

ordenImagenes: OrdenImagen[];
galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];

    constructor(
    id = '',
    incidenteId = '',
    fecIncidente = '',
    realFecIncidente: Date | string = new Date(),
    nroIncidente = '',
    iva = '',
    iibb = '',
    nombre = '',
    localidadDesde = '',
    localidadHasta = '',
    kilometros = '',
    retorno = '',
    turno = '',
    tpoEspera = '',
    conceptoFacturacionId = '',
    coPago = 0,
    deriva = '',
    importe = 0,
    flgCapitado = 0,
    rem = '',
    conf = '',
    rev = '',
    archivoOrden = '',
    ) {
      this.id = id;
      this.incidenteId = incidenteId;
      this.realFecIncidente = realFecIncidente;
      this.fecIncidente = fecIncidente;
      this.nroIncidente = nroIncidente;
      this.iva = iva;
      this.iibb = iibb;
      this.nombre = nombre;
      this.localidadDesde = localidadDesde;
      this.localidadHasta = localidadHasta;
      this.kilometros = kilometros;
      this.retorno = retorno;
      this.turno = turno;
      this.tpoEspera = tpoEspera;
      this.conceptoFacturacionId = conceptoFacturacionId;
      this.coPago = coPago;
      this.deriva = deriva;
      this.importe = importe;
      this.flgCapitado = flgCapitado;
      this.rem =  rem;
      this.conf = conf;
      this.rev = rev;
      this.archivoOrden = archivoOrden;
    }
}

export class IncidentesForExcel extends ExportMatTableToXlxs {

  // IncidenteId:	string;
  // ID:	string;
  // Fecha: string;
  // Incidente:	string;
  // Iva:	number;
  // IIBB:	string;
  // Nombre:	string;
  // Localidad_Desde:	string;
  // Localidad_Hasta:	string;
  // Kilometros:	string;
  // Retorno:	string;
  // Turno:	string;
  // Tiempo_Espera:	string;
  // Concepto_Facturacion_Id:	string;
  // CoPago:	number;
  // Deriva:	string;
  // Importe:	number;
  // FlgCapitado:	number;
  // Rem:	string;
  // Conf:	string;
  // Rev:	string;
  // ArchivoOrden:	string;

  Fecha: string;
  Incid: string;
  IVA: string;
  IIBB: string;
  Nombre: string;
  Desde: string;
  Hasta: string;
  KM: string;
  Retorno: string;
  Turno: string;
  Espera: string;
  Concepto: string;
  CoPago: string;
  Deriva: string;
  Importe: string;
  Remito: string;
  Estado: string;
  // Orden: string;


  // nroInterno: string;
  transform(base: Incidentes): IncidentesForExcel {
    const forExcel = new IncidentesForExcel();
    if (base != null) {
      const currencyPipe = new CurrencyPipe('en-US');
      forExcel.Fecha = base.fecIncidente;
      forExcel.Incid	= base.nroIncidente;
      forExcel.IVA	= base.iva?.toString();
      forExcel.IIBB	= base.iibb;
      forExcel.Nombre	= base.nombre;
      forExcel.Desde	= base.localidadDesde;
      forExcel.Hasta	= base.localidadHasta;
      forExcel.KM	= base.kilometros;
      forExcel.Retorno	= base.retorno;
      forExcel.Turno	= base.turno;
      forExcel.Espera	= base.tpoEspera;
      forExcel.Concepto	= base.conceptoFacturacionId;
      forExcel.CoPago	= currencyPipe.transform(base.coPago?.toString(), 'USD');
      forExcel.Deriva	= base.deriva;
      forExcel.Importe	= currencyPipe.transform(base.importe?.toString(), 'USD');
      forExcel.Remito	= base.rem;
      forExcel.Estado	= base.conf;
      // forExcel.Orden	= base.archivoOrden;
    }
    return forExcel;
  }
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    return super.arrayBaseToExcel(arrayBase);
  }
}
