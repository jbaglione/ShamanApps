import { TokenInfo, AccesoMicrositio, Acceso } from './index';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  email: string;
  tokenInfo: TokenInfo;
  accesos: Acceso[];
  micrositiosV1: AccesoMicrositio[] ;
}
