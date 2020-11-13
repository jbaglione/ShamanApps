import { OrdenImagen } from '@app/modules/liquidaciones/models/orden-imagen.model';
import { NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';

export interface HisopadoPaciente {
    id: number;
    fecIncidente: Date;
    nroIncidente: string;
    sintoma: string;
    diagnostico: string;
    flgResultado: number;
    resultadoPdfFullPath: string;
    resultadoPDF: string;
    resultadoJPG: string;

    pacienteFullName: string;
    tratamiento: string;

    ordenImagenes: OrdenImagen[];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
}
