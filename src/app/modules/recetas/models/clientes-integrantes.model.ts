import { Listable } from '@app/models/listable.model';

export interface ClientesIntegrantes {
  id: string;
  nroAfiliado: string;
  paciente: string;
  planId: string;

  apellido: string;
  nombre: string;
  nroDocumento: string;

  email: string;
}
