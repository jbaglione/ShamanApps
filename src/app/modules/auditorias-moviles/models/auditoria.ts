import { listable } from '@app/models/listable.model';

export class Auditoria {
    id: number;
    fecha: Date | string;
    movil: listable;
    chofer: listable;
    medico: listable;
    enfermero: listable;
    base: listable;
    prestador: listable;

    condicion: string;

    constructor(
            id: number = 0,
            fecha: Date | string = new Date(),
            movil: listable = new listable('', ''),
            chofer: listable = new listable('', ''),
            medico: listable = new listable('', ''),
            enfermero: listable = new listable('', ''),
            base: listable = new listable('', ''),
            prestador: listable = new listable('', ''),
            condicion = '',
        ) {
        this.id = id;
        this.fecha = fecha;
        this.movil = movil;
        this.chofer = chofer;
        this.medico = medico;
        this.enfermero = enfermero;
        this.base = base;
        this.prestador = prestador;
        this.condicion = condicion;
    }
}
