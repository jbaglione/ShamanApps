import { LocalidadItem } from './localidadItem';

export class DireccionFormateada {
  valor: boolean;
  altura: string;
  calle: string;
  localidad: LocalidadItem;
  // localidadId: number;
  // localidadCodigo: string;
  // localidadDesc: string;
  partidoId: string;
  codPostal: string;
  longitud: number;
  latitud: number;
  provincia: string;
  grabarCodigoPostal: boolean;
  provincias: string[];

  constructor(
    valor = false,
    altura = '',
    calle = '',
    localidad = new LocalidadItem(),
    // localidadId = 0,
    // localidadCodigo = '',
    // localidadDesc = '',
    partidoId = '',
    codPostal = '',
    longitud = 0,
    latitud = 0,
    provincia = '',
    grabarCodigoPostal = false,
    // provincias = [
    //   'Buenos Aires'
    //   , 'Catamarca'
    //   , 'Chaco'
    //   , 'Chubut'
    //   , 'Córdoba'
    //   , 'Corrientes'
    //   , 'Entre Ríos'
    //   , 'Formosa'
    //   , 'Jujuy'
    //   , 'La Pampa'
    //   , 'La Rioja'
    //   , 'Mendoza'
    //   , 'Misiones'
    //   , 'Neuquén'
    //   , 'Río Negro'
    //   , 'Salta'
    //   , 'San Juan'
    //   , 'San Luis'
    //   , 'Santa Cruz'
    //   , 'Santa Fe'
    //   , 'Santiago Del Estero'
    //   , 'Tierra Del Fuego'
    //   , 'Tucumán'
    // ]
  ) {
      this.valor = valor;
      this.altura = altura;
      this.calle = calle;
      this.localidad = localidad;
      // this.localidadId = localidadId;
      // this.localidadCodigo = localidadCodigo;
      // this.localidadDesc = localidadDesc;
      this.partidoId = partidoId;
      this.codPostal = codPostal;
      this.longitud = longitud;
      this.latitud = latitud;
      this.provincia = provincia;
      this.grabarCodigoPostal = grabarCodigoPostal;
      // this.provincias = provincias;
  }

}


