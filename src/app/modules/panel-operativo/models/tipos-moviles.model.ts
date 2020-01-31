export interface TiposMoviles {
  id: number;
  abreviaturaId: string;
  descripcion: string;
  flgDespachable: number;
  flgEmpresa: number;
  flgReqChofer: number;
  flgReqMedico: number;
  flgReqEnfermero: number;
  flgReqCoordinador: number;
  insumoId: number | null;
  regUsuarioId: number;
  regFechaHora: Date | string;
  regTerminalId: number | null;
}
