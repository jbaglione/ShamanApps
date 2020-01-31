import { GradosOperativos } from './grados-operativos.model';
import { Cliente } from './cliente.model';

export interface Incidentes {
  id: number;
  fecIncidente: Date | string;
  nroIncidente: string;
  gradoOperativo: GradosOperativos;
  cliente: Cliente;
  clienteIntegrante: Cliente;
}
