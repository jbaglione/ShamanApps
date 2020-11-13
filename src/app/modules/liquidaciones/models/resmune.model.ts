import { ResumenItem } from './resumen-item.model';

export interface Resumen {
  productividad: ResumenItem[];
  factura: ResumenItem[];
  retenciones: ResumenItem[];
  descuentos: ResumenItem[];
  pagos: ResumenItem[];
}
