import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from 'ngx-gallery';

import { PanelOperativoService } from '../../panel-operativo.service';
import { PanelOperativo } from '../../models/panel-operativo.model';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Observable, Subject, timer, Subscription } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import 'ag-grid-enterprise';
import { CustomTooltip } from '../../components/custom.tooltip.component';
import * as moment from 'moment';
import { PopUpSalidaComponent } from './popup-salida/popup-salida.component';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-panel-operativo',
  templateUrl: './panel-operativo.component.html',
  styleUrls: ['./panel-operativo.component.css']
})

export class PanelOperativoComponent implements OnInit, OnDestroy {


  subscription: Subscription;
  agTableDataSource: PanelOperativo[];
  getRowNodeId;
  gridApi;
  gridColumnApi;
  dcPanelOperativoAg;
  frameworkComponents;
  gridOptions: any;

  createColumnDefs(): any {
    return this.dcPanelOperativoAg;
  }
  createRowData(): any {
    return this.agTableDataSource;
  }
  dateFormatter(params) {
    return moment(params.value).format('HH:mm');
  }

  minuteFormatter(params): string {
    const pVal = params.value;
    let getHorarioDisplay = '';

    try {
      if ((params.value <= 0)) {
        getHorarioDisplay = '0';
      } else if ((pVal > 59)) {
        const h = pVal / 60 | 0;
        const m = pVal % 60 | 0;
        let vTpo = (h + (':' + m));

        if ((vTpo.substring(0, 1) === '0')) {
          vTpo = vTpo.substring(1, (vTpo.length - 1));
        }
        getHorarioDisplay = vTpo;
      } else {
        getHorarioDisplay = pVal.toString();
      }
    } catch (ex) {
    }
    return getHorarioDisplay;
  }

  constructor(
    private operativaClientesService: PanelOperativoService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.commonService.setTitulo('Panel Operativo');
    this.getRowNodeId = (data) => {
      return data.id;
    };

    this.dcPanelOperativoAg = [
      // {headerName: 'Grd', field: 'grado', sortable: true, filter: true, cellClassRules: {'bold-and-red': '="R"'}},
      // {
      //   headerName: 'Grd', field: 'grado', sortable: true, filter: true,
      //   cellClass(params: { value: string; }) {
      //     return params.value === 'R' ? 'bold-and-red' : 'bold-and-yellow';
      //   }
      // },
      // +25 width by cause filter button
      { headerName: 'Id', field: 'id', sortable: true, filter: true, hide: true, suppressToolPanel: true },
      {
        headerName: 'Grd', field: 'grado', width: 60, sortable: true, filter: true, headerTooltip: 'Grado',
        tooltipComponent: 'customTooltip',
        tooltipValueGetter: function (params) {
          return { value: params.value };
        },
        cellStyle(params) {
          return { 'font-weight': 'bold', backgroundColor: '#' + params.node.data.gradoColor };
        }
      },
      { headerName: 'Cliente', field: 'cliente', width: 85, sortable: true, filter: true },
      { headerName: 'Inc', field: 'nroIncidente', width: 75, sortable: true, filter: true },
      { headerName: '!', field: 'flgReclamo', width: 45, maxWidth: 45, sortable: true, filter: true },
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Servicio Reclamado", 1, 1),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Gestión Derivación", 9, 25),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Servicio Anulado", 10, 24),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Servicio en Recepción", 99, 26)}),
      // this.ImgReclamos.Name = "ImgReclamos",
      { headerName: 'L', field: 'flgAviso', width: 46, maxWidth: 46, sortable: true, filter: true },
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("", 0, -1),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Aviso Especial", 1, 0)}),
      // this.ImgAvisos.Name = "ImgAvisos",
      { headerName: 'Domicilio', field: 'domicilio', width: 215, sortable: true, filter: true },
      { headerName: 'Sintomas', field: 'sintomas', width: 200, sortable: true, filter: true },
      {
        headerName: 'Loc', field: 'localidad', width: 65, sortable: true, filter: true,
        cellStyle(params) {
          return { 'font-weight': 'bold', backgroundColor: '#' + params.node.data.zonaColor };
        }
      },
      { headerName: 'SE', field: 'sexoEdad', width: 65, sortable: true, filter: true },
      { headerName: 'Movil', field: 'movil', width: 75, sortable: true, filter: true },
      { headerName: 'M', field: 'flgEnviado', width: 50, maxWidth: 50, sortable: true, filter: true },
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Sin Mensaje", 0, -1),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Error", 1, 4),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Enviado OK", 2, 3),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Enviando", 3, 2),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Evaluando", 4, 28)}),
      // this.ImgMensaje.Name = "ImgMensaje",

      // if(pSelScreen! = scrOperativa.Programados) {
      { headerName: 'Ll/Tur', field: 'horLlamada', width: 75, valueFormatter: this.dateFormatter, sortable: true, filter: true },
      { headerName: 'Dsp', field: 'tpoDespacho', width: 80, valueFormatter: this.minuteFormatter, sortable: true, filter: true },
      { headerName: 'Sal', field: 'tpoSalida', width: 80, valueFormatter: this.minuteFormatter, sortable: true, filter: true },
      { headerName: 'Dpl', field: 'tpoDesplazamiento', width: 80, valueFormatter: this.minuteFormatter, sortable: true, filter: true },
      { headerName: 'Ate', field: 'tpoAtencion', width: 80, valueFormatter: this.minuteFormatter, sortable: true, filter: true },
      // if (setIntToBool(shamanConfig.opeColumnaTpoLlegada)) {
      { headerName: 'Lle', field: 'tpoLlegada', width: 80, valueFormatter: this.minuteFormatter, sortable: true, filter: true },
      { headerName: 'Paciente', field: 'paciente', sortable: true, filter: true },
      { headerName: 'Referencias', field: 'dmReferencia', sortable: true, filter: true },
      // }
      // else {
      // { headerName: 'Paciente', field: 'paciente', sortable: true, filter: true },
      // { headerName: 'Referencias', field: 'dmReferencia', sortable: true, filter: true },
      // }
      // }
      // else {
      // { headerName: 'fecLlamada', field: 'fecLlamada', sortable: true, filter: true },
      // { headerName: 'horLlamada', field: 'horLlamada', sortable: true, filter: true },
      // { headerName: 'Paciente', field: 'paciente', sortable: true, filter: true },
      // { headerName: 'dmReferencia', field: 'dmReferencia', sortable: true, filter: true },
      // }
      // }
    ];
    this.gridOptions = <GridOptions>{
        context: {
            componentParent: this
        }
    };
    // this.gridOptions.rowData = this.createRowData();
    // this.gridOptions.columnDefs = this.createColumnDefs();
    this.frameworkComponents = { customTooltip: CustomTooltip };

  }



  ngOnInit() {
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.operativaClientesService.GetPanelOperativo$())
    ).subscribe(result => this.agTableDataSource = result);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.autoSizeColumns();
    // this.gridOptions.getContextMenuItems = () => this.getContextMenuItems(params);
    // params.context = this;

    // this.http
    //   .get("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json")
    //   .subscribe(data => {
    //     this.rowData = data;
    //   });
  }

  getContextMenuItems(params) {

    const that = params.context.componentParent;
    const row  = params.node.data;
    const result = [
      {
        name: 'Incidente ' + row.nroIncidente,
        // action: function () {
        //   window.alert("Alerting about " + params.value);
        // },
        cssClasses: ['backgroundLightGray', 'bold']
      },
      {
        name: 'Preasignar',
        action: function () {
          try {
              if (!(params.node.data.id == null)) {
                const dialogRef = that.dialog.open(PopUpSalidaComponent, {
                  width: '95vw',
                  maxWidth: '700px',
                  data: { incidenteId: params.node.data.id }
                });
              }
          } catch (ex /*:Exception*/) {
          }
        },
        // disabled: true,
        tooltip: 'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!'
      },
      {
        name: 'Country',
        subMenu: [
          {
            name: 'Ireland',
            action: function () {
              console.log('Ireland was pressed');
            },
            icon: createFlagImg('ie')
          },
          {
            name: 'UK',
            action: function () {
              console.log('UK was pressed');
            },
            icon: createFlagImg('gb')
          },
          {
            name: 'France',
            action: function () {
              console.log('France was pressed');
            },
            icon: createFlagImg('fr')
          }
        ]
      },
      {
        name: 'Person',
        subMenu: [
          {
            name: 'Niall',
            action: function () {
              console.log('Niall was pressed');
            }
          },
          {
            name: 'Sean',
            action: function () {
              console.log('Sean was pressed');
            }
          },
          {
            name: 'John',
            action: function () {
              console.log('John was pressed');
            }
          },
          {
            name: 'Alberto',
            action: function () {
              console.log('Alberto was pressed');
            }
          },
          {
            name: 'Tony',
            action: function () {
              console.log('Tony was pressed');
            }
          },
          {
            name: 'Andrew',
            action: function () {
              console.log('Andrew was pressed');
            }
          },
          {
            name: 'Kev',
            action: function () {
              console.log('Kev was pressed');
            }
          },
          {
            name: 'Will',
            action: function () {
              console.log('Will was pressed');
            }
          },
          {
            name: 'Armaan',
            action: function () {
              console.log('Armaan was pressed');
            }
          }
        ]
      },
      // "separator",
      // {
      //   name: "Windows",
      //   shortcut: "Alt + W",
      //   action: function() {
      //     console.log("Windows Item Selected");
      //   },
      //   icon: '<img src="../images/skills/windows.png"/>'
      // },
      // {
      //   name: "Mac",
      //   shortcut: "Alt + M",
      //   action: function() {
      //     console.log("Mac Item Selected");
      //   },
      //   icon: '<img src="../images/skills/mac.png"/>'
      // },
      "separator",
      {
        name: "Checked",
        checked: true,
        action: function () {
          console.log("Checked Selected");
        },
        icon: '<img src="../images/skills/mac.png"/>'
      },
      "copy",
      "separator",
      "chartRange"
    ];
    return result;
  }

}
function createFlagImg(flag) {
  return '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' + flag + '.png"/>';
}

function Preasignar_Click(incidenteId) {
  try {
      if (!(incidenteId == null)) {
        const dialogRef = this.dialog.open(PopUpSalidaComponent, {
          width: '95vw',
          maxWidth: '700px',
          data: { incidenteId }
        });
      }
  } catch (ex /*:Exception*/) {
  }
}

