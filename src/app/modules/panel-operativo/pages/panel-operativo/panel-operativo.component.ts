import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from 'ngx-gallery';

import { PanelOperativoService } from '../../panel-operativo.service';
import { PanelOperativo } from '../../models/panel-operativo.model';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Observable, Subject, timer, Subscription } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-panel-operativo',
  templateUrl: './panel-operativo.component.html',
  styleUrls: ['./panel-operativo.component.css']
})

export class PanelOperativoComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  agTableDataSource: PanelOperativo[];
  getRowNodeId;
  // gridApi;
  // gridColumnApi;

  constructor(
    private operativaClientesService: PanelOperativoService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.commonService.setTitulo('Panel Operativo');
    this.getRowNodeId = (data) => {
      return data.id;
    };
  }

  dcPanelOperativoAg = [
    // {headerName: 'Grd', field: 'grado', sortable: true, filter: true, cellClassRules: {'bold-and-red': '="R"'}},
    // {
    //   headerName: 'Grd', field: 'grado', sortable: true, filter: true,
    //   cellClass(params: { value: string; }) {
    //     return params.value === 'R' ? 'bold-and-red' : 'bold-and-yellow';
    //   }
    // },
    { headerName: 'Id', field: 'id', sortable: true, filter: true, hide: true, suppressToolPanel: true },
    {
      headerName: 'Grd', field: 'grado', sortable: true, filter: true,
      cellStyle(params) {
        return { 'font-weight': 'bold', backgroundColor: '#' + params.node.data.gradoColor };
      }
    },
    { headerName: 'Inc', field: 'nroIncidente', sortable: true, filter: true },
    { headerName: 'Domicilio', field: 'domicilio', sortable: true, filter: true },
    { headerName: 'Sintomas', field: 'sintomas', sortable: true, filter: true },
    // {headerName: 'Localidad Desc', field: 'localidadDescripcion', sortable: true, filter: true},
    {
      headerName: 'Localidad', field: 'localidad', sortable: true, filter: true,
      cellStyle(params) {
        return { 'font-weight': 'bold', backgroundColor: '#' + params.node.data.zonaColor };
      }
    },
    { headerName: 'SE', field: 'sexoEdad', sortable: true, filter: true },
    { headerName: 'Movil', field: 'movil', sortable: true, filter: true }

  ];

  ngOnInit() {
      this.subscription = timer(0, 10000).pipe(
        switchMap(() => this.operativaClientesService.GetPanelOperativo$())
      ).subscribe(result => this.agTableDataSource = result);
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;

  //   this.http
  //     .get("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json")
  //     .subscribe(data => {
  //       this.rowData = data;
  //     });
  // }

  // getContextMenuItems(params) {
  //   var result = [
  //     {
  //       name: "Alert " + params.value,
  //       action: function() {
  //         window.alert("Alerting about " + params.value);
  //       },
  //       cssClasses: ["redFont", "bold"]
  //     },
  //     {
  //       name: "Always Disabled",
  //       disabled: true,
  //       tooltip: "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!"
  //     },
  //     {
  //       name: "Country",
  //       subMenu: [
  //         {
  //           name: "Ireland",
  //           action: function() {
  //             console.log("Ireland was pressed");
  //           },
  //           icon: createFlagImg("ie")
  //         },
  //         {
  //           name: "UK",
  //           action: function() {
  //             console.log("UK was pressed");
  //           },
  //           icon: createFlagImg("gb")
  //         },
  //         {
  //           name: "France",
  //           action: function() {
  //             console.log("France was pressed");
  //           },
  //           icon: createFlagImg("fr")
  //         }
  //       ]
  //     },
  //     {
  //       name: "Person",
  //       subMenu: [
  //         {
  //           name: "Niall",
  //           action: function() {
  //             console.log("Niall was pressed");
  //           }
  //         },
  //         {
  //           name: "Sean",
  //           action: function() {
  //             console.log("Sean was pressed");
  //           }
  //         },
  //         {
  //           name: "John",
  //           action: function() {
  //             console.log("John was pressed");
  //           }
  //         },
  //         {
  //           name: "Alberto",
  //           action: function() {
  //             console.log("Alberto was pressed");
  //           }
  //         },
  //         {
  //           name: "Tony",
  //           action: function() {
  //             console.log("Tony was pressed");
  //           }
  //         },
  //         {
  //           name: "Andrew",
  //           action: function() {
  //             console.log("Andrew was pressed");
  //           }
  //         },
  //         {
  //           name: "Kev",
  //           action: function() {
  //             console.log("Kev was pressed");
  //           }
  //         },
  //         {
  //           name: "Will",
  //           action: function() {
  //             console.log("Will was pressed");
  //           }
  //         },
  //         {
  //           name: "Armaan",
  //           action: function() {
  //             console.log("Armaan was pressed");
  //           }
  //         }
  //       ]
  //     },
  //     "separator",
  //     {
  //       name: "Windows",
  //       shortcut: "Alt + W",
  //       action: function() {
  //         console.log("Windows Item Selected");
  //       },
  //       icon: '<img src="../images/skills/windows.png"/>'
  //     },
  //     {
  //       name: "Mac",
  //       shortcut: "Alt + M",
  //       action: function() {
  //         console.log("Mac Item Selected");
  //       },
  //       icon: '<img src="../images/skills/mac.png"/>'
  //     },
  //     "separator",
  //     {
  //       name: "Checked",
  //       checked: true,
  //       action: function() {
  //         console.log("Checked Selected");
  //       },
  //       icon: '<img src="../images/skills/mac.png"/>'
  //     },
  //     "copy",
  //     "separator",
  //     "chartRange"
  //   ];
  //   return result;
  // }

}
// function createFlagImg(flag) {
//   return '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' + flag + '.png"/>';
// }
