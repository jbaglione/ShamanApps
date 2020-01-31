import { FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PanelOperativoService } from '../../panel-operativo.service';
import { PanelOperativo } from '../../models/panel-operativo.model';
import { CommonService } from '@app/modules/shared/services/common.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  frameworkComponents;
  gridOptions: any;

  constructor(
    private operativaClientesService: PanelOperativoService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.commonService.setTitulo('Panel Operativo');
    this.getRowNodeId = (data) => {
      return data.id;
    };

    this.gridOptions = ({ context: { componentParent: this } } as GridOptions);
    // this.gridOptions.rowData = this.createRowData();
    this.gridOptions.paginationAutoPageSize = true;
    this.gridOptions.pagination = true;
    this.gridOptions.deltaRowDataMode = true;
    // this.gridOptions.getRowNodeId = this.getRowNodeId();
    this.gridOptions.allowContextMenuWithControlKey = true;
    this.gridOptions.frameworkComponents = this.frameworkComponents;
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.frameworkComponents = { customTooltip: CustomTooltip };
    this.gridOptions.components = {
      cellRendererReclamo: this.CellRendererReclamo,
      cellRendererAviso: this.CellRendererAviso,
      cellRendererEnviado: this.CellRendererEnviado
    };
  }

  CellRendererReclamo(params: { value: number; }) {
    const element = document.createElement('span');
    const imageElement = document.createElement('img');
    // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("", 0, -1),
    // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Aviso Especial", 1, 0)}),
    // this.ImgAvisos.Name = "ImgAvisos",
    // 0 = > aviso => Content/Notes_16x16.png
    // 1 = > reclamo => people/assigntome_16x16.png
    // 24 = > rechazo => images/conditional%20formatting/iconsetredtoblack4_16x16.png
    // visually indicate if this months value is higher or lower than last months value

    if (params.value === 1) {
      imageElement.src = './assets/images/DevExpressImages/People/AssignToMe_16x16.png';
      element.title = 'Servicio Reclamado';
    } else if (params.value === 10) {
      imageElement.src = './assets/images/DevExpressImages/Conditional_Formatting/IconSetRedToBlack4_16x16.png';
      element.title = 'Servicio Anulado';
    } else if (params.value === 99) {
      imageElement.src = './assets/images/DevExpressImages/People/Female_16x16.png';
      element.title = 'Servicio en Recepción';
    }
    element.appendChild(imageElement);
    // element.appendChild(document.createTextNode(params.value.toString()));
    return element;
  }

  CellRendererAviso(params: { value: number; }) {
    const element = document.createElement('span');
    const imageElement = document.createElement('img');
    if (params.value === 1) {
      imageElement.src = './assets/images/DevExpressImages/Content/Notes_16x16.png';
      element.title = 'Aviso Especial';
    }
    element.appendChild(imageElement);
    // element.appendChild(document.createTextNode(params.value));
    return element;
  }

  CellRendererEnviado(params: { value: number; }) {
    const element = document.createElement('span');
    const imageElement = document.createElement('img');

    switch (params.value) {
      case 0: {
        element.title = 'Sin Mensaje';
        break;
      } case 1: {
        element.title = 'Error';
        imageElement.src = './assets/images/DevExpressImages/Actions/Cancel_16x16.png';
        break;
      } case 2: {
        element.title = 'Enviado OK';
        imageElement.src = './assets/images/DevExpressImages/Actions/Apply_16x16.png';
        break;
      } case 3: {
        element.title = 'Enviando';
        imageElement.src = './assets/images/DevExpressImages/Actions/Convert_16x16.png';
        break;
      } case 4: {
        element.title = 'Evaluando';
        imageElement.src = './assets/images/DevExpressImages/Actions/Convert_16x16.png';
        break;
      }
    }
    element.appendChild(imageElement);
    // element.appendChild(document.createTextNode(params.value));
    return element;
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
  }

  createColumnDefs(): any {
    return [
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
        tooltipValueGetter(params) {
          return { value: params.value };
        },
        cellStyle(params) {
          return { 'font-weight': 'bold', backgroundColor: '#' + params.node.data.gradoColor };
        }
      },
      { headerName: 'Cliente', field: 'cliente', width: 85, sortable: true, filter: true },
      { headerName: 'Inc', field: 'nroIncidente', width: 75, sortable: true, filter: true },
      { headerName: '!', field: 'flgReclamo', width: 45, maxWidth: 45, sortable: true, filter: true, cellRenderer: 'cellRendererReclamo' },
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Servicio Reclamado", 1, 1),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Gestión Derivación", 9, 25),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Servicio Anulado", 10, 24),
      // new DevExpress.XtraEditors.Controls.ImageComboBoxItem("Servicio en Recepción", 99, 26)}),
      // this.ImgReclamos.Name = "ImgReclamos",
      { headerName: 'L', field: 'flgAviso', width: 46, maxWidth: 46, sortable: true, filter: true, cellRenderer: 'cellRendererAviso' },
      { headerName: 'Domicilio', field: 'domicilio', width: 215, sortable: true, filter: true },
      { headerName: 'Sintomas', field: 'sintomas', width: 200, sortable: true, filter: true },
      {
        headerName: 'Loc', field: 'localidad', width: 65, sortable: true, filter: true,
        cellStyle(params) {
          return { 'font-weight': 'bold', backgroundColor: '#' + params.node.data.zonaColor };
        }
      },
      { headerName: 'SE', field: 'sexoEdad', width: 65, sortable: true, filter: true },
      {
        headerName: 'Movil', field: 'movil', width: 75, sortable: true, filter: true,
        cellStyle(params) {
          return { 'font-weight': 'bold', Color: '#' + params.node.data.MovilColor };
        }
      },
      { headerName: 'M', field: 'flgEnviado', width: 50, maxWidth: 50, sortable: true, filter: true, cellRenderer: 'cellRendererEnviado' },
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
      } else if (pVal > 59) {
        const h = pVal / 60 | 0;
        const m = pVal % 60 | 0;
        let vTpo = (h + (':' + m));

        if (vTpo.substring(0, 1) === '0') {
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

  getContextMenuItems(params) {

    const that = params.context.componentParent;
    const row = params.node.data;
    const result = [
      {
        name: 'Incidente ' + row.nroIncidente,
        cssClasses: ['backgroundLightGray', 'bold']
      },
      {
        name: 'Preasignar',
        action() {
          try {
            if (!(params.node.data.id == null)) {
              const dialogRef = that.dialog.open(PopUpSalidaComponent, {
                width: '95vw',
                maxWidth: '825px',
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
            action() {
              console.log('Ireland was pressed');
            },
            icon: createFlagImg('ie')
          },
          {
            name: 'UK',
            action() {
              console.log('UK was pressed');
            },
            icon: createFlagImg('gb')
          },
          {
            name: 'France',
            action() {
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
            action() {
              console.log('Niall was pressed');
            }
          },
          {
            name: 'Sean',
            action() {
              console.log('Sean was pressed');
            }
          },
          {
            name: 'John',
            action() {
              console.log('John was pressed');
            }
          },
          {
            name: 'Alberto',
            action() {
              console.log('Alberto was pressed');
            }
          },
          {
            name: 'Tony',
            action() {
              console.log('Tony was pressed');
            }
          },
          {
            name: 'Andrew',
            action() {
              console.log('Andrew was pressed');
            }
          },
          {
            name: 'Kev',
            action() {
              console.log('Kev was pressed');
            }
          },
          {
            name: 'Will',
            action() {
              console.log('Will was pressed');
            }
          },
          {
            name: 'Armaan',
            action() {
              console.log('Armaan was pressed');
            }
          }
        ]
      },
      'separator',
      {
        name: 'Checked',
        checked: true,
        action() {
          console.log('Checked Selected');
        },
        icon: '<img src="../images/skills/mac.png"/>'
      },
      'copy',
      'separator',
      'chartRange'
    ];
    return result;
  }

}
function createFlagImg(flag) {
  return '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' + flag + '.png"/>';
}

// function Preasignar_Click(incidenteId) {
//   try {
//     if (!(incidenteId == null)) {
//       const dialogRef = this.dialog.open(PopUpSalidaComponent, {
//         width: '95vw',
//         maxWidth: '810px',
//         data: { incidenteId }
//       });
//     }
//   } catch (ex /*:Exception*/) {
//   }
// }

