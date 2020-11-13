import { DireccionFormateada } from './DireccionFormateada';

export class PreIncidentesServicios {
  id: number;
  clienteId: number; // buscara Id en tab clientes, es el cliente logeado.
  fecha: Date | string;
  hora: string;
  nroServicio: number;
  estado: number;
  direccionFormateada: DireccionFormateada;
  // calle: string;
  // altura: number;
  // partido: string;
  // localidad: string;
  // localidadId: number;
  // provincia: string;
  // latitud: number;
  // longitud: number;
  piso: number;
  depto: string;
  entreCalle1: string;
  entreCalle2: string;
  referencia: string;
  virDomicilio: string;
  nroAfiliado: string; // number;
  sexo: string;
  edad: string;
  sintoma: string;
  grado: string;
  nombre: string;
  apellido: string;
  plan: string;
  iva: string;
  coPago: number;
  telefono: string;
  observaciones: string;
  constructor(id = 0, clienteId = 0, fecha = new Date(), hora = '', nroServicio = 0, estado = 0, direccionFormateada = new DireccionFormateada, piso = 0, depto = '', entreCalle1 = '', entreCalle2 = '', referencia = '', virDomicilio = '', nroAfiliado = '', // 0,
    sexo = '', edad = '', sintoma = '', grado = '', nombre = '', apellido = '', plan = '', iva = '', coPago = 0, telefono = '', observaciones = '') {
    this.id = id;
    this.clienteId = clienteId;
    this.fecha = fecha;
    this.hora = hora;
    this.nroServicio = nroServicio;
    this.estado = estado;
    this.direccionFormateada = direccionFormateada;
    this.piso = piso;
    this.depto = depto;
    this.entreCalle1 = entreCalle1;
    this.entreCalle2 = entreCalle2;
    this.referencia = referencia;
    this.virDomicilio = virDomicilio;
    this.nroAfiliado = nroAfiliado;
    this.sexo = sexo;
    this.edad = edad;
    this.sintoma = sintoma;
    this.grado = grado;
    this.nombre = nombre;
    this.apellido = apellido;
    this.plan = plan;
    this.iva = iva;
    this.coPago = coPago;
    this.telefono = telefono;
    this.observaciones = observaciones;
  }
}
