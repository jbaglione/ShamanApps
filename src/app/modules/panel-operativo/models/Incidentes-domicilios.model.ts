import { Incidentes } from './Incidentes.model';
import { Localidad } from './Localidad.model';

export interface IncidentesDomicilios {
  id: number;
  incidente: Incidentes;
  localidad: Localidad;
  tipoDomicilio: number;
  nroAnexo: number;
  tipoOrigen: number;
  DmCalle: string;
  dmAltura: number;
  dmPiso: string;
  dmDepto: string;
  domicilio: string;
  localidadId: number;
  dmEntreCalle1: string;
  dmEntreCalle2: string;
  dmReferencia: string;
  dmLatitud: number | null;
  dmLongitud: number | null;
  sanatorioId: number | null;
  regUsuarioId: number;
  regFechaHora: Date | string;
  regTerminalId: number | null;
}
