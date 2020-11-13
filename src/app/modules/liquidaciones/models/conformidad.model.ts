export interface Conformidad {
  fecIncidente: string;
  fecIncidenteString: string;
  nroIncidente: string;
  conformidadId: number;
  flgConforme: number;
  terLiqMotivoReclamoId: number;
  importe: number;
  virImpLiquidado: number;
  virImpDiferencia: number;
  observaciones: string;
  respuesta: string;
  cerrado: number;
  flgRespuesta: number;
  fecServer: Date | string;
}
