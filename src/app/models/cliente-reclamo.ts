export class ClienteReclamo {
    id: number;
    nro: number;
    razonSocial: string;
    fecInicio: Date | string;
    tipoReclamo: string;
    motivo: string;
    cliente: string;
    situacion: number;
    situacionDescripcion: string;
    administrador: string;
    prioridad: string;
    fecIncidente: Date | string;
    nroIncidente: string;

    constructor
        (
            id: number = 0,
            nro: number = 1,
            razonSocial = '',
            fecInicio: Date | string = new Date(),
            tipoReclamo: string = '',
            motivo: string = '',
            cliente: string = '',
            situacion: number = 0,
            situacionDescripcion: string = '',
            administrador: string = '',
            prioridad: string = '',
            fecIncidente: Date | string = new Date(),
            nroIncidente: string = ''
        ) {
        this.id = id;
        this.nro = nro;
        this.razonSocial = razonSocial;
        this.fecInicio = fecInicio;
        this.tipoReclamo = tipoReclamo;
        this.motivo = motivo;
        this.cliente = cliente;
        this.situacion = situacion;
        this.situacionDescripcion = situacionDescripcion;
        this.administrador = administrador;
        this.prioridad = prioridad;
        this.fecIncidente = fecIncidente;
        this.nroIncidente = nroIncidente;
    }
}