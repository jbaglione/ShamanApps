import { PreIncidentesServicios } from './preIncidentesServicios';
import { ClienteInfo } from '../../../models/clienteInfo';


export interface PreIncidentesDialogData {
  id: string;
  acceso: string;
  preincidente: PreIncidentesServicios;
  clienteInfo: ClienteInfo;
}
