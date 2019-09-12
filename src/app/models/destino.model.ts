export class Destino
{
    id: number;
    usuario: string;
    finalizacionPermiso: boolean;
    constructor (
            id: number = 0,
            usuario: string = "aaaa",
            finalizacionPermiso:boolean = false)
            {
                this.id = id;
                this.usuario = usuario,
                this.finalizacionPermiso = finalizacionPermiso;
            }
}

