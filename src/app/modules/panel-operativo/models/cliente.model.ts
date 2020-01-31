export interface Cliente {
  id: number;
  abreviaturaId: string;
  razonSocial: string;
  rubroClienteId: number;
  dmCalle: string;
  dmAltura: number;
  dmPiso: string;
  dmDepto: string;
  domicilio: string;
  // **Puede obtenerlos desde api/Localidades */
  localidadId: number;
  codigoPostal: string;
  dmEntreCalle1: string;
  dmEntreCalle2: string;
  dmReferencia: string;
  dmLatitud: number | null;
  dmLongitud: number | null;
  cuit: string;
  // **Puede obtenerlos desde api/EmpresasLegales */
  empresaLegalId: number;
  // **Puede obtenerlos desde api/SituacionesIva */
  situacionIvaId: number;
  letraHabitual: string;
  puntoVentaHabitual: number | null;
  // **Puede obtenerlos desde api/AlicuotasIva */
  alicuotaIvaId: number;
  flgCategorizacionPropia: boolean;
  fecIngreso: Date | string | null;
  fecEgreso: Date | string | null;
  fecInactivo: Date | string | null;
  activo: boolean;
  // **Puede obtenerlos desde api/planes */
  planId: number | null;
  facForma: boolean;
  facFrecuencia: number;
  facFormaBonificacion: boolean;
  facImporte: number;
  facPorBonificacion: number;
  facFormaRecargo: boolean;
  // **Puede obtenerlos desde api/formaspago */
  formaPagoId: number;
  // **Puede obtenerlos desde api/cobradores */
  cobradorId: number;
  nroContrato: string;
  saldo: number;
  saldoInicial: number;
  ultimoPerEmitido: number | null;
  flgIngresoSubGrupos: boolean;
  tipoConvenio: number;
  convenioId: number;
  vendedorId: number | null;
  // **Puede obtenerlos desde api/MotivosBaja */
  motivoBajaId: number | null;
  observaciones: string;
  observacionesBaja: string;
  rcpMetodoId: number | null;
  rcpWskey: number | null;
  rcpRabbitAlias: string;
  rcpObservaciones: string;
  // **Puede obtenerlos desde api/GruposOperativos */
  grupoOperativoId: number | null;
  geoCobertura: number | null;
  geoLocalidadId: number | null;
  geoKmDesde: number | null;
  geoKmHasta: number | null;
  flgAeropuerto: boolean;
  flgGdoCobPropia: boolean;
  facCopagoNcb: number | null;
  virActivo: boolean;
}
