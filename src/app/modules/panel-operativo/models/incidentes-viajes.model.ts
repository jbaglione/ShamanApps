import { IncidentesDomicilios } from './incidentes-domicilios.model';
import { Moviles } from './moviles.model';

export interface IncidentesViajes {
    viajeId: string;
    reqHorLlegada: Date | string;
    reqHorInternacion: Date | string;
    reqMovHorLlegada: Date | string;
    reqMovHorInternacion: Date | string;
    eveInicioReal: Date | string;
    eveFinalReal: Date | string;
    flgStatus: number;
    flgModoDespacho: number;
    demora: number;
    flgKmtPersonalizado: number;
    kilometraje: number;
    flgFacPersonalizado: number;
    impFacturacion: number;
    flgLiqPersonalizado: number;
    impLiquidacion: number;

    incidenteDomicilio: IncidentesDomicilios;
    // movil: Moviles;
    movilPreasignado: Moviles;

    movilId: number;
    movilPreasignadoId: number;
    movilApoyoId: number;


    // diagnostico: Diagnosticos;
    // motivoNoRealizacion: MotivosNoRealizacion;

    // No existe en el modelo real
    // HorarioOperativo: HorarioOperativo;
    // MotivoDemoraDespachoId: MotivosDemoras;
    // MotivoDemoraLlegadaId: MotivosDemoras;

}
