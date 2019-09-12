import { TokenInfo, AccesoMicrositio, Acceso } from './index';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  email: string;
  tokenInfo: TokenInfo;
  acceso: string;
  accesos: Acceso[];
  micrositiosV1: AccesoMicrositio[] ;
}
