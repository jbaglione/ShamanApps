import { TiposMoviles } from './tipos-moviles.model';

export interface Moviles {
  id: number;
  relTabla: number;
  movil: string;
  tipoMovil: TiposMoviles;
  // BaseOperativaId: BasesOperativas;
  // VehiculoId: Vehiculos;
  // PrestadorId: Prestadores;
  // PersonalId: Personal;
  flgGeoCobPropia: number;
  flgGdoCobPropia: number;
  activo: number;

  // For Grid
  flgObservaciones: boolean;
  estado: string;
  distanciaTiempo: number;
  link: string;
  sel: boolean;
  gpsFecHorTransmision: string;
  gpsLatitud: string;
  gpsLongitud: string;
  Distancia: string;
  Tiempo: string;
  NroPrioridad: number;
  ModoCobertura: number;
  Observaciones: string;
}
