import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from 'ngx-gallery';

import { PanelOperativoService } from '../../panel-operativo.service';
import { PanelOperativo } from '../../models/panel-operativo.model';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-panel-operativo',
  templateUrl: './panel-operativo.component.html',
  styleUrls: ['./panel-operativo.component.css']
})

export class PanelOperativoComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private operativaClientesService: PanelOperativoService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.commonService.setTitulo('Visor ECGs');
  }
  // Filtros para busqueda
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;

  paneloperativo$: Observable<PanelOperativo[]>;

  // Datos para grilla
  isLoading = false;
  dcPanelOperativo = [
    'incidenteId',
    'grado',
    'cliente'
  ];

  mtPanelOperativo: MatTableDataSource<PanelOperativo> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChildren(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;
  columnDefs = [
    {headerName: 'Make', field: 'make' },
    {headerName: 'Model', field: 'model' },
    {headerName: 'Price', field: 'price'}
];

rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
];

dcPanelOperativoAg = [
  {headerName: 'Incidente', field: 'incidenteId', sortable: true, filter: true},
  {headerName: 'Grado', field: 'grado', sortable: true, filter: true},
  {headerName: 'Cliente', field: 'cliente', sortable: true, filter: true}
];

agTableDataSource;

  ngOnInit() {
    this.descripcionInput = new FormControl();
    this.getPanelOperativo();
  }

  setDataSourceAttributes() {
    this.mtPanelOperativo.paginator = this.paginator;
    this.mtPanelOperativo.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtPanelOperativo.filter = filterValue;
  }
  getPanelOperativo() {
    const that = this;
    that.isLoading = true;

    that.paneloperativo$ = that.operativaClientesService.GetPanelOperativo$();

    that.paneloperativo$.subscribe(
      paneloperativo => {
        if (paneloperativo == null) {
          return;
        }
        this.agTableDataSource = paneloperativo;
        paneloperativo.forEach((panel) =>  {
          panel.galleryOptions = that.buildGalleryOptionsObject(panel);
          panel.galleryImages = new Array<NgxGalleryImage>();
          // panel.panelOperativoImagenes.forEach((panelImagen) =>  {
          //   panel.galleryImages.push(
          //     that.buildGalleryImage(panelImagen.fullPath)
          //   );
          // });
        });
        that.isLoading = false;
        this.mtPanelOperativo = new MatTableDataSource(paneloperativo);
        this.setDataSourceAttributes();
      },
      err => { this.isLoading = false; }
    );
  }

  buildGalleryOptionsObject(electro: PanelOperativo): NgxGalleryOptions[] {
    return [
      {
        image: false,
        thumbnails: false,
        width: '0px',
        height: '0px',
        previewDownload: false,
        previewZoom: true,
        previewRotate: true,
        previewSwipe: true,
        previewFullscreen: true,
        previewCloseOnEsc: true,
        previewKeyboardNavigation: true,
        previewBullets: true,
        previewZoomMax: 10,
        actions: [
          {
            icon: 'fa fa-download',
            disabled: false,
            titleText: 'Descargar',
            onClick: function(event, index) {
              const a = document.createElement('a');
              a.href = this.galleryImages[index].medium;
              a.download = 'descarga_1';
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
            }.bind(electro)
          }
        ]
      }
    ];
  }

  buildGalleryImage(imageFullPath: string): NgxGalleryImage {
    return {
      small: imageFullPath,
      medium: imageFullPath,
      big: imageFullPath,
      description: ''
    };
  }

  openGallery(pIndex: any) {
    this.query.forEach(function(value, index, array) {
      if (pIndex === index) {
        value.openPreview(0);
      }
    });
  }

  prevMonth(date: Date): Date {
    const thisMonth = date.getMonth();
    date.setMonth(thisMonth - 1);
    if ((date.getMonth() !== thisMonth - 1) && (date.getMonth() !== 11 || (thisMonth === 11 && date.getDate() === 1))) {
      date.setDate(0);
    }
    return date;
  }
}
