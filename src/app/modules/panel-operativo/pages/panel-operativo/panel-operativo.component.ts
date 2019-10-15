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

  constructor(
    private operativaClientesService: PanelOperativoService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.commonService.setTitulo('Panel Operativo');
  }

  subscription: Subscription;
  agTableDataSource: PanelOperativo[];

  dcPanelOperativoAg = [
    // {headerName: 'Grd', field: 'grado', sortable: true, filter: true, cellClassRules: {'bold-and-red': '="R"'}},
    // {
    //   headerName: 'Grd', field: 'grado', sortable: true, filter: true,
    //   cellClass(params: { value: string; }) {
    //     return params.value === 'R' ? 'bold-and-red' : 'bold-and-yellow';
    //   }
    // },
    // { headerName: 'Id', field: 'id', sortable: true, filter: true },
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

}
