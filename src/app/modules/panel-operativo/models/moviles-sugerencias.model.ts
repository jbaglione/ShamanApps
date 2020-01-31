import { Moviles } from './moviles.model';

export interface MovilesSugerencias {
  id: number;
  movil: Moviles;

  nroPrioridad: string;
  modoCobertura: string;

  estado: string;
  sel: boolean;
  gpsFecHorTransmision: Date | string;
  gpsLatitud: number;
  gpsLongitud: number;
  distancia: number;
  tiempo: number;
  distanciaTiempo: string;
  link: string;

  flgObservaciones: boolean;
  observaciones: string;
}
