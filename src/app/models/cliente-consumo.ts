export class ClienteConsumo {
    id: number;
    nro: number;
    razonSocial: string;
    fecIncidente: Date | string;
    nroIncidente: string;
    horLlamada: string;
    gradoId: string;
    color: string;
    domicilio: string;
    localidad: string;
    cierre: string;
    movil: string;
    horLlegada: string;
    horFinal: string;

    constructor
        (
            id: number = 0,
            nro: number = 1,
            razonSocial = '',
            fecIncidente: Date | string = new Date(),
            nroIncidente: string = '',
            horLlamada: string = '',
            gradoId: string = '',
            color: string = '',
            domicilio: string = '',
            localidad: string = '',
            cierre: string = '',
            movil: string = '',
            horLlegada: string = '',
            horFinal: string = ''
        ) {
        this.id = id;
        this.nro = nro;
        this.razonSocial = razonSocial;
        this.fecIncidente = fecIncidente;
        this.nroIncidente = nroIncidente;
        this.horLlamada = horLlamada;
        this.gradoId = gradoId;
        this.color = color;
        this.domicilio = domicilio;
        this.localidad = localidad;
        this.cierre = cierre;
        this.movil = movil;
        this.horLlegada = horLlegada;
        this.horFinal = horFinal;
    }
}
