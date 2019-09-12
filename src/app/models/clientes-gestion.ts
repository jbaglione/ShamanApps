import { listable } from './listable.model';
import { ClienteAdjuntos } from './clienteAdjuntos.model';

export class ClientesGestion {
    id: number;
    clienteId: number;
    razonSocial: string;
    tipoGestion: listable;
    observaciones: string;
    // pdfgestion:byte[];
    fecha: Date | string;
    fechaRecontacto: Date | string;
    fulldescription: string;
    adjunto: ClienteAdjuntos;

    constructor
        (
            id: number = 0,
            clienteId: number = 0,
            razonSocial = '',
            tipoGestion: listable = new listable('', ''),
            observaciones: string = '',
            fecha: Date | string = new Date(),
            fechaRecontacto: Date | string = new Date(),
            fulldescription: string = '',
            adjunto: ClienteAdjuntos = new ClienteAdjuntos()
        ) {
        this.id = id;
        this.clienteId = clienteId;
        this.razonSocial = razonSocial;
        this.tipoGestion = tipoGestion;
        this.observaciones = observaciones;
        this.fecha = fecha;
        this.fechaRecontacto = fechaRecontacto;
        this.fulldescription = fulldescription;
        this.adjunto = adjunto;
    }
}