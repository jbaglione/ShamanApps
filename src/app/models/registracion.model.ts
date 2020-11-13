import { Adjunto } from './adjunto.model';
import { NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';

export class Registracion {
  id: string;
  usuario: string;
  fecha: Date | string;
  hora: string;
  descripcion: string;
  adjuntos: Adjunto[];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(
    id: string = '0',
    usuario: string = '',
    fecha: Date | string = new Date(),
    hora: string = '',
    descripcion: string = '',
    adjuntos: Adjunto[] = []) {
    this.id = id;
    this.usuario = usuario;
    this.fecha = fecha;
    this.hora = hora;
    this.descripcion = descripcion;
    this.adjuntos = adjuntos;
  }
}
