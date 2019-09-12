import { ClientePotencial } from './cliente-potencial.model';


export class Afiliacion {
    id: number;
    clientePotencial: ClientePotencial;
    constructor
        (
            id: number = 0,
            clientePotencial: ClientePotencial = new ClientePotencial()) {
        this.id = id;
        this.clientePotencial = clientePotencial;
    }
}
