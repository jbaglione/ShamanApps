export class Localidad {
    localidadId: string;
    localidadDescripcion: string;
    partidoId: string;

    constructor(
        localidadId: string = "",
        localidad: string = "",
        partidoId: string = ""){
        this.localidadId = localidadId;
        this.localidadDescripcion = localidad;
        this.partidoId = partidoId;
    }
}