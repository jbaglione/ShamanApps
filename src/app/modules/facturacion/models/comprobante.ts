export interface Comprobante {
  id: number;
  formatedFecha: Date | string;
  tipoComprobante: string;
  nroComprobante: string;
  importeExento: number;
  importeGravado: number;
  porcentajeIva: number;
  importeIva: number;
  porcentajeARBA: number;
  importeARBA: number;
  porcentajeAGIP: number;
  importeAGIP: number;
  importe: number;
}

export interface ExportableBlob {
  url: string;
  blob: Blob;
}
