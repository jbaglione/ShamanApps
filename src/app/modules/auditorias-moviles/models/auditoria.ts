export class Auditoria {
    id: number;
    fecha: Date | string;
    dominioId: string;
    chofer: string;
    medico: string;
    enfermero: string;
    condicion: string;

    constructor(
            id: number = 0,
            fecha: Date | string = new Date(),
            dominioId = '',
            chofer = '',
            medico = '',
            enfermero = '',
            condicion = '',
        ) {
        this.id = id;
        this.fecha = fecha;
        this.dominioId = dominioId;
        this.chofer = chofer;
        this.medico = medico;
        this.enfermero = enfermero;
        this.condicion = condicion;
    }
}
