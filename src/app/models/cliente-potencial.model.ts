import { Rubro } from './rubro.model';
import { CondicionIVA } from './condicionIVA.model';
import { Localidad } from './localidad.model';
import { listable } from './listable.model';
import { extend } from 'webdriver-js-extender';
// import { Exportable } from './exportable.interface';
import { ExportMatTableToXlxs } from '@app/modules/shared/helpers/export-mat-table-to-xlxs';

export class ClientePotencial {
  clienteId: number;
  nombreComercial: string;
  rubroObj: Rubro;
  razonSocial: string;
  cuit: string;
  cuitNumber: number;
  condicionIVAObj: CondicionIVA;
  latitud: string;
  longitud: string;
  domicilio: string;
  calle: string;
  altura: number;
  piso: number;
  depto: string;
  referencia: string;
  entreCalle1: string;
  entreCalle2: string;
  codigoPostal: string;
  localidadObj: Localidad;
  estado: number; // todo: potencial = 1, activo = 2, inactivo = 3, 4 = Suspendido
  credencialID: string; // todo: potencial no tienen codigocliente
  importeMensual: number;
  motivoSuspension: listable;
  potencialExito: number;
  usuarioShamanId: string;
  constructor
    (
      clienteId: number = 0,
      nombreComercial: string = '',
      rubro: Rubro = new Rubro(),
      razonSocial: string = '',
      cuit: string = '',
      cuitNumber: number = 0,
      condicionIVA: CondicionIVA = new CondicionIVA(),
      latitud: string = '',
      longitud: string = '',
      domicilio: string = '',
      calle: string = '',
      altura: number = 0,
      piso: number = 0,
      depto: string = '',
      referencia: string = '',
      entreCalle1: string = '',
      entreCalle2: string = '',
      codigoPostal: string = '',
      localidad: Localidad = new Localidad(),
      estado: number = 0, // todo: potencial = 1, activo = 2, inactivo = 3
      credencialID: string = '', // todo: potencial no tienen codigocliente
      importeMensual: number = 0,
      motivoSuspension: listable = new listable('', ''),
      potencialExito: number = 0,
      usuarioShamanId: string = ''
    ) {
    this.clienteId = clienteId;
    this.nombreComercial = nombreComercial;
    this.rubroObj = rubro;
    this.razonSocial = razonSocial;
    this.cuit = cuit;
    this.cuitNumber = cuitNumber;
    this.condicionIVAObj = condicionIVA;
    this.latitud = latitud;
    this.longitud = longitud;
    this.domicilio = domicilio;
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.depto = depto;
    this.referencia = referencia;
    this.entreCalle1 = entreCalle1;
    this.entreCalle2 = entreCalle2;
    this.codigoPostal = codigoPostal;
    this.localidadObj = localidad;
    this.estado = estado;
    this.credencialID = credencialID; // nro de cliente
    this.importeMensual = importeMensual;
    this.motivoSuspension = motivoSuspension;
    this.potencialExito = potencialExito;
    this.usuarioShamanId = usuarioShamanId;
  }
}

export class ClientePotencialForExcel extends ExportMatTableToXlxs {

  Nombre_Comercial: string;
  Rubro: string;
  Razon_Social: string;
  Cuit: string;
  Domicilio: string;
  Localidad: string;
  Nro_Cliente: string;
  Presupuesto: number;
  Afiliacion: number;
  Motivo_Suspension: string;
  Potencial_Exito: number;
  Usuario_Shaman: string;

  transform(clientePotencial: ClientePotencial): ClientePotencialForExcel {
      const forExcel = new ClientePotencialForExcel();
      if (clientePotencial != null) {
      const localidadDesc = clientePotencial.localidadObj != null ? clientePotencial.localidadObj.localidadDescripcion : '';
      const rubroDesc = clientePotencial.rubroObj != null ? clientePotencial.rubroObj.descripcion : '';
      const motivoSuspensionDesc = clientePotencial.motivoSuspension != null ? clientePotencial.motivoSuspension.descripcion : '';

      forExcel.Nombre_Comercial = clientePotencial.nombreComercial;
      forExcel.Rubro = rubroDesc;
      forExcel.Razon_Social = clientePotencial.razonSocial;
      forExcel.Cuit = clientePotencial.cuit;
      forExcel.Domicilio = clientePotencial.domicilio;
      forExcel.Localidad = localidadDesc;
      forExcel.Nro_Cliente = clientePotencial.credencialID,
      forExcel.Presupuesto = clientePotencial.importeMensual,
      forExcel.Afiliacion = clientePotencial.estado,
      forExcel.Motivo_Suspension = motivoSuspensionDesc,
      forExcel.Potencial_Exito = clientePotencial.potencialExito;
      forExcel.Usuario_Shaman = clientePotencial.usuarioShamanId;
    }
    return forExcel;
  }
  arrayBaseToExcel(arrayBase: any[]): ExportMatTableToXlxs[] {
    return super.arrayBaseToExcel(arrayBase);
  }
}
