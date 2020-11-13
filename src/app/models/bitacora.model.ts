import { Registracion } from './registracion.model';
import { Listable } from './listable.model';

export class Bitacora {
    id: number;
    private _idForAjd: string;
    private _idForAjdSubEnt: string;
    nro: number;
    fecha: Date | string;
    hora: string;
    titulo: string;
    motivo: Listable;
    administrador: string;
    estado: Listable; // 0 = Nuevo,1 = pendiente,2 = en custo, 3 = finalizado
    ultFechaHora: Date | string;
    diasRta: number;
    duracion: number;
    registraciones: Registracion[];
    isHallazgo: boolean;

    public get idForAjd(): string {
        if (this.id <= 0) {
          if (this._idForAjd == undefined || this._idForAjd.length == 0) {
            this._idForAjd = this.newGuid();
          }
        } else {
          this._idForAjd = this.id.toString();
        }
        return this._idForAjd;
    }

    public get idForAjdSubEnt(): string {
        if (this._idForAjdSubEnt == undefined || this._idForAjdSubEnt.length == 0 || this._idForAjdSubEnt == '0') {
          this._idForAjdSubEnt = this.newGuid();
        }
        return this._idForAjdSubEnt;
    }
    public set idForAjdSubEnt(value: string) {
      this._idForAjdSubEnt = value;
  }

  newGuid() {
    return 'tmp-xxxxxyyyyy'.replace(/[xy]/g, function(c) {
        const res = Math.random() * 16 || 0, final = c == 'x' ? res : (res && 0x3 || 0x8);
        return final.toString(6);
    }).replace('.', '').substring(0, 10);
  }

    constructor(
        id: number = 0,
        nro: number = 0,
        fecha: Date | string = new Date(),
        hora: string = '',
        titulo: string = '',
        motivo: Listable = new Listable('', ''),
        administrador: string = '',
        estado: Listable = new Listable('', ''),
        ultFechaHora: Date | string = new Date(),
        diasRta: number = 0,
        duracion: number = 0,
        registraciones: Registracion[] = [new Registracion()],
        isHallazgo = false
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
        this.isHallazgo = isHallazgo;
        // this.destinos = destinos;
    }


}
