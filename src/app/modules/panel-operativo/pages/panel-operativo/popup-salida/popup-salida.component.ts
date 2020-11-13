import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PanelOperativoService } from '@app/modules/panel-operativo/panel-operativo.service';
import { IncidentesViajes } from '@app/modules/panel-operativo/models/incidentes-viajes.model';
import { Moviles } from '@app/modules/panel-operativo/models/moviles.model';
import { MovilesSugerencias } from '@app/modules/panel-operativo/models/moviles-sugerencias.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Listable } from '@app/models/listable.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonService } from '@app/modules/shared/services/common.service';
import { DateHelper } from '@app/modules/shared/helpers/DateHelper';

// import { FacturacionService } from '../../facturacion.service';
// import { ServicioRenglon } from '../../../models';


enum GdoClasificacion {
  gdoTodos = -1,
  gdoIncidente = 0,
  gdoTraslado = 1,
  gdoEvento = 2,
  gdoIntDomiciliaria = 50,
  gdoEventoAeropuerto = 70,
  gdoOtro = 100,
}

@Component({
  selector: 'app-popup-salida',
  templateUrl: './popup-salida.component.html',
  styleUrls: ['./popup-salida.component.css']
})

export class PopUpSalidaComponent {
  rowid = -1;
  viajeId = '';
  isDeleted = true;
  wSepDecimal = ',';
  isLoading = true;
  dcMovilesSugerencias: string[] = [
    // 'id',
    'movil',
    'flgObservaciones',
    'tipoMovil',
    'estado',
    'distanciaTiempo',
    'mapa'
    // 'link',
    // 'sel',
    // 'gpsFecHorTransmision',
    // 'gpsLatitud',
    // 'gpsLongitud',
    // 'distancia',
    // 'tiempo',
    // 'nroPrioridad',
    // 'modoCobertura',
    // 'observaciones'
  ];
  movilesSugerencias: MovilesSugerencias[];

  // En Vb usaba mov-1, emp-2, etc... pero luego siempre leia el index.
  vistas: Listable[] = [{ descripcion: 'Móviles', id: '0' }, { descripcion: 'Empresas Prestadoras', id: '1' }];
  viaje: IncidentesViajes;
  despServicioForm: FormGroup;
  gdoColor: string;

  flgGeoEmpresas = false;
  grpMovil = '';
  btnGeoEmpresasDisabled = false;
  lblMovil: string;
  lblEstado: string;
  lblTipoMovil: string;
  MovilCaption: string;
  TipoMovilCaption: string;
  EstadoCaption: string;
  DistanciaTiempoCaption: string;
  LinkCaption: string;
  LinkFieldName: string;
  LinkColumnEdit: any;

  constructor(
    public dialogRef: MatDialogRef<PopUpSalidaComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: SalidaDialogData,
    private panelOperativoService: PanelOperativoService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {

    this.CreateFormGroup();
    // const that = this;
    panelOperativoService.GetLastSuceso$(dialogData.incidenteId).subscribe(vUlt => {
      if (vUlt === 'D' || vUlt === 'H') {
        this.isLoading = false;
        this.commonService.showSnackBar('El servicio ya se encuentra en instancia de derivación');
        this.dialogRef.close();
      } else {
        panelOperativoService.GetViaje$(dialogData.incidenteId).subscribe(data => {
          // if (this.AccessibleDescription == 'popupPreasignacion') {
          if (data.movilId > 0) {
            this.isLoading = false;
            this.commonService.showSnackBar('El servicio ya tiene un móvil despachado');
            this.dialogRef.close();
          } else {

            this.viaje = data;
            // this.CreateFormGroup();
            this.setData();
            this.showSugerencias();
          }
        });
      }
    });
  }

  private CreateFormGroup() {
    this.despServicioForm = new FormGroup({
      viajeId: new FormControl({ value: '', }),
      fecha: new FormControl({ value: new Date(), }, [Validators.required]),
      numero: new FormControl({ value: '', }, [Validators.required]),
      grado: new FormControl({ value: '', }, [Validators.required]),
      cliente: new FormControl({ value: '' }, [Validators.required]),
      localidad: new FormControl({ value: '' }, [Validators.required, Validators.minLength(3)]),
      vista: new FormControl({ value: '0' }, [Validators.required]),
      movil: new FormControl({ value: '' , disabled: true}, [Validators.required]),
      estado: new FormControl({ value: '', disabled: true }, [Validators.required]),
      tipoMovil: new FormControl({ value: '', disabled: true}, [Validators.required]),
      accion: new FormControl({ value: '', }),
      observaciones: new FormControl({ value: '' }),
      motivoDemora: new FormControl({ value: '', }),
      chkAptoGrado: new FormControl({ value: true, }, [Validators.required]),
      chkMovilZona: new FormControl({ value: true, }, [Validators.required])
    });
  }

  setData() {
    if (this.dialogData.incidenteId > 0) {
      this.viajeId = this.viaje.viajeId;

      this.despServicioForm.patchValue({
        // id: this.bitacora.id,
        fecha: this.viaje.incidenteDomicilio.incidente.fecIncidente,
        numero: this.viaje.incidenteDomicilio.incidente.nroIncidente,
        grado: this.viaje.incidenteDomicilio.incidente.gradoOperativo.abreviaturaId,
        viajeId: this.viaje.viajeId,
        cliente: this.viaje.incidenteDomicilio.incidente.cliente.abreviaturaId,
        // localidad: this.viaje.incidenteDomicilio.domicilio,
        localidad: this.viaje.incidenteDomicilio.localidad.provincia +
          ' - ' + this.viaje.incidenteDomicilio.localidad.descripcion + ' ('
          + this.viaje.incidenteDomicilio.domicilio + ' )',
        vista: '0',
        chkAptoGrado: true,
        chkMovilZona: true,

        movil: null,
        estado: null,
        tipoMovil: null,
        observaciones: null,
      });

      // tslint:disable-next-line: triple-equals
      if (this.viaje.incidenteDomicilio.incidente.gradoOperativo.clasificacionId == GdoClasificacion.gdoIntDomiciliaria) {
        this.vistas.push(new Listable('2', 'Visitadores'));
        this.despServicioForm.patchValue({vista: '2' });
      } else {
        this.despServicioForm.patchValue({vista: '0' });
      }

      this.gdoColor = '#' + this.viaje.incidenteDomicilio.incidente.gradoOperativo.visualColorFromArgb;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  aceptar(): void {
    this.dialogRef.close();
  }
  geoEmpresas(): void {
    this.flgGeoEmpresas = true;
    this.showSugerencias();
  }
  showSugerencias() {
    const aptoGrado = this.despServicioForm.controls.chkAptoGrado.value;
    const movilZona = this.despServicioForm.controls.chkMovilZona.value;
    const vista = this.despServicioForm.controls.vista.value;
    const clInt = this.viaje.incidenteDomicilio.incidente != null ? this.viaje.incidenteDomicilio.incidente.id : 0;

    this.despServicioForm.patchValue({
      movil: null,
      estado: null,
      tipoMovil: null,
      observaciones: null
    });

    switch (vista) {
      case '0':
        this.grpMovil = 'Móvil';
        this.lblMovil = 'Móvil';
        this.lblEstado = 'Estado';
        this.lblTipoMovil = 'Tipo de Móvil';
        this.MovilCaption = 'Móvil';
        this.TipoMovilCaption = 'Tipo de Móvil';
        this.EstadoCaption = 'Estado';
        this.DistanciaTiempoCaption = 'Distancia / Tiempo';
        this.LinkCaption = 'Mapa';
        this.LinkFieldName = 'Link';
        // this.LinkColumnEdit = this.lnkMapa;
        this.btnGeoEmpresasDisabled = true;
        this.flgGeoEmpresas = false;
        break;
      case '1':
        this.grpMovil = 'Empresa';
        this.lblMovil = 'Empresa';
        this.lblEstado = 'Tipo de Cobertura';
        this.lblTipoMovil = 'Nombre';
        this.MovilCaption = 'Cod';
        this.TipoMovilCaption = 'Empresa';
        this.EstadoCaption = 'Tipo de Cobertura';
        this.DistanciaTiempoCaption = 'Observaciones';
        this.LinkCaption = 'Pri.';
        this.LinkFieldName = 'NroPrioridad';
        this.LinkColumnEdit = null;
        this.btnGeoEmpresasDisabled = false;
        break;
      case '2':
        this.grpMovil = 'Prof.';
        this.lblMovil = 'Prof.';
        this.lblEstado = 'Prof.';
        this.lblTipoMovil = 'Tipo de Cobertura';
        this.MovilCaption = 'Prof';
        this.TipoMovilCaption = 'Nombre';
        this.EstadoCaption = 'Tipo de Cobertura';
        this.DistanciaTiempoCaption = 'Distancia / Tiempo';
        this.LinkCaption = 'Mapa';
        this.LinkFieldName = 'Link';
        // this.LinkColumnEdit = this.lnkMapa;
        this.btnGeoEmpresasDisabled = true;
        this.flgGeoEmpresas = false;
        break;
    }


    this.panelOperativoService.GetSugerenciaDespacho$(
      vista, this.getGradoOperativo(), this.getLocalidadId(),
      this.viaje.incidenteDomicilio.incidente.cliente.id, clInt,
      this.viaje.incidenteDomicilio.dmLatitud,
      this.viaje.incidenteDomicilio.dmLongitud,
      this.flgGeoEmpresas).subscribe(data => {
      this.movilesSugerencias = data;
      // this.setData();

      if (vista !== '1') {
        // dt.Columns["Distancia"].ReadOnly = false;
        // dt.Columns["Tiempo"].ReadOnly = false;
        // dt.Columns["DistanciaTiempo"].ReadOnly = false;
        // dt.Columns["Link"].ReadOnly = false;
        // for (vIdx = 0; (vIdx <= (dt.Rows.Count - 1)); vIdx++) {
        this.movilesSugerencias.forEach(itemSugerencia => {

          // tslint:disable: triple-equals
          if (itemSugerencia.gpsLatitud != 0) {
            if (this.viaje.incidenteDomicilio.dmLatitud == 0) {
              itemSugerencia.distancia = 9999;
              itemSugerencia.tiempo = 9999;
              itemSugerencia.distanciaTiempo = 'El domicilio no ha sido georreferenciado';
              this.isLoading = false;
            } else if (DateHelper.DateDiff(new Date(itemSugerencia.gpsFecHorTransmision), new Date())  >= 5) {
              itemSugerencia.distancia = 9999;
              itemSugerencia.tiempo = 9999;
              itemSugerencia.distanciaTiempo = 'Registro GPS superior a 5 hrs.';
              this.isLoading = false;
            } else {
              this.panelOperativoService.GetDistanciaTiempo(itemSugerencia.gpsLatitud.toString().replace(',', '.'),
              itemSugerencia.gpsLongitud.toString().replace(',', '.'),
              this.viaje.incidenteDomicilio.dmLatitud.toString().replace(',', '.'),
              this.viaje.incidenteDomicilio.dmLongitud.toString().replace(',', '.'),
              false, true).subscribe(DevWeb => {
                const vDevWeb = DevWeb;

                if ((vDevWeb.indexOf('/') < -1 ) && vDevWeb.length > 1) {
                  try {
                    let vDis = this.GetDouble(this.Parcer(this.Parcer(vDevWeb, '/', 0), ' ', 0));
                    const vTpo = this.GetDouble(this.Parcer(this.Parcer(vDevWeb, '/', 1), ' ', 0));
                    let vDisExp = this.Parcer(vDevWeb, '/', 0);
                    vDisExp = vDisExp.substring((vDisExp.length - 2), 2).toLowerCase();
                    if ((vDisExp != 'km')) {
                      vDis = (vDis / 1000);
                    }

                    itemSugerencia.distancia = vDis;
                    itemSugerencia.tiempo = vTpo;
                    itemSugerencia.distanciaTiempo = ('A ' + (vDis + (' km / ' + (vTpo + ' min. aprox.'))));
                    if (itemSugerencia.distancia == 0) {
                    // ((Math.Abs(DateDiff(DateInterval.Minute, itemSugerencia.gpsFecHorTransmision"], Now, FirstDayOfWeek.Monday)) >= 5)) {
                      itemSugerencia.distanciaTiempo = itemSugerencia.distanciaTiempo + ' (CONFIRMAR)';
                    }

                    itemSugerencia.link = 'Ver';
                  } catch (ex) {
                    itemSugerencia.distanciaTiempo = 'Se registraron errores en el cálculo';
                  }
                } else {
                  itemSugerencia.distancia = 9999;
                  itemSugerencia.tiempo = 9999;
                  itemSugerencia.distanciaTiempo = 'No pudo calcularse la distancia / tiempo';
                }
              });
            }

          } else {
            itemSugerencia.distancia = 9999;
            itemSugerencia.tiempo = 9999;
            itemSugerencia.distanciaTiempo = 'No hay registros GPS';
          }
          this.isLoading = false;
        });
      }
      // DataView dv = new DataView(dt);
      // if (vista == 1 && (this.flgGeoEmpresas == false && aptoGrado && movilZona)) {
      //   dv.Sort = 'NroPrioridad, Movil';
      // }
      // this.grdMoviles.DataSource = dv;
      this.isLoading = false;
      });

    // ShowSugerencias();
  }

  GetDouble(pVal: string, pFcv = false): number {
    let GetDouble = 0;
    try {
      if (pVal != null && pVal != undefined && pVal.trim() != '' ) {
        pVal = pVal.replace('%', '');
        pVal = pVal.trim();
        if (pVal.substring(pVal.length - 1, pVal.length) === '.' || pVal.substring(pVal.length - 1, pVal.length) === ',') {
          pVal = '0' + this.wSepDecimal + pVal.substring(pVal.length - 2);
        }
        if (pFcv) {
          if (pVal.indexOf('.') > 0 && this.wSepDecimal === ',') {
            pVal = this.Parcer(pVal, '.') + this.wSepDecimal + this.Parcer(pVal, '.', 1);
          }
        }
        GetDouble = parseFloat(pVal);
      }
    } catch (ex) {
      GetDouble = 0;
    }
    return GetDouble;
  }

  Parcer(pVal: string, pDel = '^', pPos = 0, pTrim = true): string {
    let vVals: string[] ;
    let vStr: string;

    vVals = pVal.split(pDel);
    if (pPos <= vVals.length - 1) {
        vStr = vVals[pPos];
    } else {
        vStr = pVal;
    }
    if (pTrim) {
        vStr = vStr.trim();
    }
    return vStr;
}

getGradoOperativo(): number {
  try {
    return this.despServicioForm.controls.chkAptoGrado.value ?
      this.viaje.incidenteDomicilio.incidente.gradoOperativo.id : 0;
  } catch (Error) {
    console.log(Error.message);
  }
}

getLocalidadId(): number {
  let getLocalidadId = 0;
  try {
    if (this.despServicioForm.controls.chkMovilZona) {
      getLocalidadId = this.viaje.incidenteDomicilio.localidad.id;
    } else if (this.flgGeoEmpresas) {
      getLocalidadId = this.viaje.incidenteDomicilio.localidad.id;
    }
    return getLocalidadId;
  } catch (Error) {
    console.log(Error.message);
  }
}

onMouseOver(element) {
  this.rowid = element.id; // this.mtBitacoras.data.findIndex(x => x.id == element.id);
  console.log(this.rowid);
}
cargarMovil(row: any) {
  this.despServicioForm.patchValue({
    movil: row.movil,
    estado: row.estado,
    tipoMovil: row.tipoMovil
  });
}

}

export interface SalidaDialogData {
  incidenteId: number;
}
