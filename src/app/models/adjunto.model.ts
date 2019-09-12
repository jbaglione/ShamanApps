import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';

export class Adjunto {
    id: number;
    path: string;
    name: string;
    fullPath: string;

    constructor(
        id: number = 0,
        path: string = '',
        name: string = '',
        fullPath: string = '') {
        this.id = id;
        this.path = path;
        this.name = name;
        this.fullPath = fullPath;
    }
}
export class AdjuntoGalery {
    adjuntos: Adjunto[];
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
}
