export class MovilesAuditorias {
    id: string;
    vehiculoId: number;
    baseOperativaId: number;
    choferId: number;
    enfermeroId: number;
    medicoId: number;
    prestadorId: number;

    constructor(
            id: string = '',
            vehiculoId: number = 0,
            baseOperativaId: number = 0,
            choferId: number = 0,
            enfermeroId: number = 0,
            medicoId: number = 0,
            prestadorId: number = 0
        ) {
        this.id = id;
        this.vehiculoId = vehiculoId;
        this.baseOperativaId = baseOperativaId;
        this.choferId = choferId;
        this.enfermeroId = enfermeroId;
        this.medicoId = medicoId;
        this.prestadorId = prestadorId;
    }
}
