import { IncidenteCalculo } from './indidente-calculo.model';

export interface IncidenteDetalle {
  fecIncidente: string;
  nroIncidente: string;
  paciente: string;
  sexo: string;
  edad: string;
  origen: string;
  destino: string;
  anexo1: string;
  anexo2: string;
  concepto: string;
  motivo: string;
  importe: number;
  coPago: number;
  horDespacho: string;
  horLlegada: string;
  incidenteCalculoList: IncidenteCalculo[];
}
