export interface Moli {
    id: number;
    fecIncidente: string;
    fecIncidenteDate: Date | string;
    nroIncidente: string;
    clienteID: string;
    llamada: Date | string;
    llamadaDate: Date | string;
    integranteId: string;
    nombre: string;
    domicilio: string;
    localidad: string;
    sintoma: string;
    grado: string;
}

// export interface MoliClean {
//   Fecha_Incidente: string;
//   Inc: string;
//   Llamada: Date | string;
//   Nro_Afiliado: string;
//   Paciente: string;
//   Domicilio: string;
//   Localidad: string;
//   Sintoma: string;
//   Grado: string;
// }
