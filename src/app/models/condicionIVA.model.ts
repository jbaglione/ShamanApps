export class CondicionIVA {
    id: number;
    descripcion: string;

    constructor(
        id: number = 0,
        descripcion: string = "",
        ){
        this.id = id;
        this.descripcion = descripcion;
    }
}