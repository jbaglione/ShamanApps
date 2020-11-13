import { OrdenImagen } from '@app/modules/liquidaciones/models/orden-imagen.model';
import { NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';

export interface Hisopado {
    id: number;
    fecIncidente: Date;
    nroIncidente: string;
    clienteId: string;
    nroAfiliado: string;
    paciente: string;
    nroDocumento: number;
    fecNacimiento: Date;
    estado: string;
    resultado: string;
    resultadoPdfFullPath: string;
    flgInformePDF: number;
    resultadoJPG: string;

    ordenImagenes: OrdenImagen[];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
}
