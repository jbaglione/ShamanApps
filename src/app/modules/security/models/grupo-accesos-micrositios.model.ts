import { AccesoMicrositio } from './acceso-micrositio.model';

export interface GrupoAccesosMicrositios {
  numero: number;
  nombre: string;
  accesosMicrositios: AccesoMicrositio[];
}
