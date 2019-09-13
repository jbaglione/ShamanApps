import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit} from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryComponent } from 'ngx-gallery';

import { OperativaClientesService } from '../../operativa-clientes.service';
import { Electro } from '../../models/electro.model';
import { CommonService } from '@app/services/common.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-electros',
  templateUrl: './electros.component.html',
  styleUrls: ['./electros.component.css']
})

export class ElectrosComponent implements OnInit  {
  // Filtros para busqueda
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;

  electros$: Observable<Electro[]>;

  // Datos para grilla
  isLoading: Boolean = false;
  dcElectros: string[] = [
    'nroIncidente',
    'fechaIncidente',
    'codCliente',
    'nroAfiliado',
    'paciente',
    'sintomas',
    'verImagenesElectros'
  ];
  mtElectros: MatTableDataSource<Electro> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChildren(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;

  @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private operativaClientesService: OperativaClientesService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.commonService.setTitulo('Visor ECGs');
  }

  ngOnInit() {
    this.desde = new FormControl(this.prevMonth(new Date()));
    this.hasta = new FormControl(new Date());
    this.descripcionInput = new FormControl();
    this.getElectros();
  }

  setDataSourceAttributes() {
    this.mtElectros.paginator = this.paginator;
    this.mtElectros.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.mtElectros.filter = filterValue;
  }

  getElectros() {
    const that = this;
    that.isLoading = true;

    that.electros$ = that.operativaClientesService.GetElectros$(this.desde.value, this.hasta.value);

    that.electros$.subscribe(
      electros => {
        if (electros == null) {
          return;
        }
        electros.forEach(function(electro) {
          electro.galleryOptions = that.buildGalleryOptionsObject(electro);
          electro.galleryImages = new Array<NgxGalleryImage>();
          electro.electroImagenes.forEach(function(electroImagen) {
            electro.galleryImages.push(
              that.buildGalleryImage(electroImagen.fullPath)
            );
          });
        });
        that.isLoading = false;
        this.mtElectros = new MatTableDataSource(electros);
        this.setDataSourceAttributes();
      },
      err => { this.isLoading = false; }
    );
  }

  buildGalleryOptionsObject(electro: Electro): NgxGalleryOptions[] {
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

  prevMonth(date: Date): Date{
    const thisMonth = date.getMonth();
    date.setMonth(thisMonth - 1);
    if ((date.getMonth() !== thisMonth - 1) && (date.getMonth() !== 11 || (thisMonth === 11 && date.getDate() === 1)))
    {
      date.setDate(0);
    }
    return date;
  }
}
