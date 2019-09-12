export class ClienteCuentaCorriente {
    id: number;
    nro: number;
    fecDocumento: Date | string;
    tipoComprobante: string;
    nroComprobante: string;
    debe: number;
    haber: number;
    comprobanteDescargable: boolean;

    constructor
        (
            id: number = 0,
            nro: number = 1,
            fecDocumento: Date | string = new Date(),
            tipoComprobante: string = "",
            nroComprobante: string = "",
            debe: number = 0,
            haber: number = 0,
            comprobanteDescargable: boolean = false
    ) {
        this.id = id;
        this.nro = nro;
        this.fecDocumento = fecDocumento;
        this.tipoComprobante = tipoComprobante;
        this.nroComprobante = nroComprobante;
        this.debe = debe;
        this.haber = haber;
        this.comprobanteDescargable = comprobanteDescargable;
    }
}