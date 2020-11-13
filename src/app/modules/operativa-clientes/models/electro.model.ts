import { ElectroImagen } from './index';
import { NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';

export interface Electro {
    incidenteId: number;
    fechaIncidente: Date;
    nroIncidente: string;
    nroAfiliado: string;
    paciente: string;
    sintomas: string;
    subcarpeta: string;
    archivoECG: string;
    electroImagenes: ElectroImagen[];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
}
