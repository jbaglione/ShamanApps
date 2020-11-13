import { ClientesRecetas } from './clientes-recetas.model';
import { Medicamentos } from './medicamentos.model';
import { Listable } from '@app/models/listable.model';
import { ClienteInfo } from '@app/models/clienteInfo';

export class Recetas {
  id: number;
  nroReceta: number;
  cliente: ClientesRecetas; // Prepaga
  clienteInfo: ClienteInfo;
  nroAfiliado: string;
  plan: Listable;
  nombre: string;
  email: string;

  flgFueraPadron: number;

  fecReceta: Date | string;
  fecHorCreacion: string;
  diagnostico: string;
  flgTratamientoProlongado: number;
  medicamentos: Medicamentos[];

  medico: string;
  usuarioExtranetEmisorId: number;

  clienteIdString: string;
  planIdString: string;

  constructor(recetaInter: any) {
    this.id = recetaInter.id;
    this.nroReceta = recetaInter.nroReceta;
    this.cliente = recetaInter.cliente;
    this.clienteInfo = recetaInter.clienteInfo;
    this.nroAfiliado = recetaInter.nroAfiliado;
    this.plan = recetaInter.plan;
    this.nombre = recetaInter.nombre;
    this.email = recetaInter.email;

    this.flgFueraPadron = recetaInter.flgFueraPadron;

    this.fecReceta = recetaInter.fecReceta;
    this.fecHorCreacion = recetaInter.fecHorCreacion;
    this.diagnostico = recetaInter.diagnostico;
    this.flgTratamientoProlongado = recetaInter.flgTratamientoProlongado;
    this.medicamentos = recetaInter.medicamentos;

    this.medico = recetaInter.medico;
    this.usuarioExtranetEmisorId = recetaInter.usuarioExtranetEmisorId;

    this.clienteIdString = this.cliente?.clienteId;
    this.planIdString = this.plan?.id;
  }

}

// {
//  "resourceType":"MedicationRequest",
//  "identificador": [{ identificador }], //  ID externos de este solicitar
//  "estado":"< código >", // activo | en espera | cancelado | completado | ingresado por error | detenido | borrador | desconocido
//  "statusReason": { CodeableConcept }, //  Motivo del estado actual
//  "intent":"< code >", //  propuesta | plan | orden | orden original | orden reflejo | orden de llenado | orden de instancia | opción
//  "categoría": [{ CodeableConcept }], //  Tipo de uso de medicamentos
//  "prioridad":"< código >", //  rutina | urgente | lo antes posible | stat
//  "doNotPerform": < boolean >,
//   // reportado [x]: Reportado en lugar de registro primario . Uno de ellos 2:
//  "reportedBoolean": < boolean >,
//  "reportedReference": { Referencia ( Paciente | practicante | PractitionerRole |
//     RelatedPerson | Organización ) },
//    // la medicación [x]: Los medicamentos que deben tomarse . Uno de ellos 2:
//  "medicationCodeableConcept": { CodeableConcept },
//  "medicationReference": { Referencia (Medicación ) },
//  "sujeto": { Referencia ( Paciente | Grupo ) }, //  R!   Quién o grupo de solicitud de medicación es para
//  "encuentro": { Referencia ( Encuentro ) }, //  Encuentro creado como parte del encuentro / admisión / estadía
//  "supportInformation": [{ Referencia ( Cualquiera ) }], //  Información para apoyar el pedido de la medicación
//  "autor":"< dateTime>", //  Cuando la solicitud se creó inicialmente
//  "solicitante": { Referencia ( Practitioner | PractitionerRole | Organización |
//     Paciente | RelatedPerson | Device ) }, //  Quién / Qué solicitó la Solicitud
//  "performer": { Reference ( Practitioner | PractitionerRole | Organización |
//     Paciente | Dispositivo | Persona relacionada | CareTeam ) },//  Ejecutante previsto de la administración
//  "performerType": { CodeableConcept }, //  Tipo deseado de intérprete de la
//  "grabadora"de administración de medicamentos : { Referencia ( Practitioner | PractitionerRole ) }, //  Persona que ingresó la solicitud
//  "reasonCode": [{ CodeableConcept }], //  Motivo o indicación para ordenar o no ordenar el medicamento
//  "reasonReference": [{ Reference ( Condition |Observación ) }], //  Condición u observación que respalda por qué la receta se escribe
//  "instantiatesCanonical": ["< canonical >"], //  Instancia el protocolo FHIR o la definición
//  "instantiatesUri": ["< uri >"], / /  Instancia el protocolo externo o la definición
//  "basedOn": [{ Reference ( CarePlan | MedicationRequest | ServiceRequest |
//     ImmunizationRecommendation ) }],//  Qué solicitud cumple
//  "groupIdentifier": { Identifier }, //  Solicitud compuesta que forma parte de
//  "courseOfTherapyType": { CodeableConcept }, //  Patrón general de
//  "seguro"de administración de medicamentos : [{ Reference ( Coverage | ClaimResponse ) }], //  Seguro asociado
//  "nota"de cobertura : [{ Anotación }], //  Información sobre la receta
//  "dosisInstrucción": [{ Dosificación }],//  Cómo se debe tomar el medicamento
//  "dispenseRequest": { //  Autorización de suministro de medicamentos
//    "initialFill": { //  Primeros detalles de
//      "cantidad": { Cantidad ( SimpleQuantity ) }, //  Cantidad de primer llenado
//      "duración": { Duración } //  Duración del primer llenado
//     },
//    "dispenseInterval": { Duration }, //  Período mínimo de tiempo entre dispensas
//    "validityPeriod": { Period }, //  El suministro del período de tiempo está autorizado para
//    "numberOfRepeatsAllowed":"< unsignedInt >", //  Número de recargas autorizadas
//    "cantidad": { Cantidad ( Cantidad simple ) }, //  Cantidad de medicamento para suministrar por dispensar
//    "esperadaSupplyDuration": { Duración }, //  Número de días de suministro por dispensador
//    "ejecutante":{ Referencia ( Organización )} //  Dispensador previsto
//   },
//  "sustitución": { //  Cualquier restricción en la sustitución de medicamentos
//      // permitida [x]: si la sustitución está permitida o no . Uno de estos 2:
//    "allowBoolean": < boolean >,
//    "allowedCodeableConcept": { CodeableConcept },
//    "reason": { CodeableConcept } //  ¿Por qué debería (no) realizarse la sustitución
//   },
//  "priorPrescription":) }, //  Un pedido / receta que se está reemplazando
//  "detectIssue": [{ Reference ( DetectedIssue ) }], //  Problema clínico con la acción
//  "eventHistory": [{ Reference ( Provenance ) }] //  Una lista de eventos de interés en el ciclo de vida
// }

