export interface MensajeItem {
  id: number;
  fecha: Date;
  emisor: string;
  contenido: string;
  estadoId: number;
  leido: boolean;
}
