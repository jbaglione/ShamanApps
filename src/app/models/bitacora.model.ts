import { Registracion } from './registracion.model';
import { listable } from './listable.model';

export class Bitacora {
    id: number;
    nro: number;
    fecha: Date | string;
    hora: string;
    titulo: string;
    motivo: listable;
    administrador: string;
    estado: listable; // 0 = Nuevo,1 = pendiente,2 = en custo, 3 = finalizado
    ultFechaHora: Date | string;
    diasRta: number;
    duracion: number;
    registraciones: Registracion[];
    constructor(
        id: number = 0,
        nro: number = 0,
        fecha: Date | string = new Date(),
        hora: string = '',
        titulo: string = '',
        motivo: listable = new listable('', ''),
        administrador: string = '',
        estado: listable = new listable('', ''),
        ultFechaHora: Date | string = new Date(),
        diasRta: number = 0,
        duracion: number = 0,
        registraciones: Registracion[] = [new Registracion()],
        // destinos: Destino[]=[new Destino()],
    ) {
        this.id = id;
        this.nro = nro;
        this.fecha = fecha;
        this.hora = hora;
        this.titulo = titulo;
        this.motivo = motivo;
        this.administrador = administrador;
        this.estado = estado;
        this.ultFechaHora = ultFechaHora;
        this.diasRta = diasRta;
        this.duracion = duracion;
        this.registraciones = registraciones;
        // this.destinos = destinos;
    }
}
