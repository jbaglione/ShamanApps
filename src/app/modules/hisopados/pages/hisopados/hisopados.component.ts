import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HisopadosService } from '../../hisopados.service';
import { Hisopado } from '../../models/hisopado.model';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Observable } from 'rxjs';
import { FileService } from '@app/modules/shared/services/files.service';
import { NgxGalleryImage, NgxGalleryComponent, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-hisopados',
  templateUrl: './hisopados.component.html',
  styleUrls: ['./hisopados.component.css']
})

export class HisopadosComponent implements OnInit {
  // Filtros para busqueda
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;

  hisopados$: Observable<Hisopado[]>;

  // Datos para grilla
  isLoading: Boolean = false;
  dcHisopados: string[] = [
    'nroIncidente',
    'fecIncidente',
    'clienteId',
    'nroAfiliado',
    'paciente',
    'estado',
    'flgInformePDF', // Informe COVID
    'resultado',
    'resultadoPDF-JPG',
  ];
  mtHisopados: MatTableDataSource<Hisopado> = new MatTableDataSource();
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  @ViewChildren(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;

  constructor(
    private operativaClientesService: HisopadosService,
    private commonService: CommonService,
    public dialog: MatDialog,
    public fileService: FileService
  ) {
    this.commonService.setTitulo('Gestión de Hisopados');
  }

  ngOnInit() {
    this.desde = new FormControl(this.prevMonth(new Date()));
    this.hasta = new FormControl(new Date());
    this.descripcionInput = new FormControl();
    this.getHisopados();
  }

  setDataSourceAttributes() {
    this.mtHisopados.paginator = this.paginator;
    this.mtHisopados.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtHisopados.filter = filterValue;
  }

  getHisopados() {
    const that = this;
    that.isLoading = true;
    // PDFResultado: \\archivos02\shamanAdj$\Incidendes\(20200730\10088981_2.pdf)
    that.hisopados$ = that.operativaClientesService.getHisopados(this.desde.value, this.hasta.value);

    that.hisopados$.subscribe(
      hisopados => {
        if (hisopados == null) {
          return;
        }
        that.isLoading = false;
        this.mtHisopados = new MatTableDataSource(hisopados);
        this.setDataSourceAttributes();

        hisopados.forEach(function (hisopado) {
          hisopado.galleryOptions = that.buildGalleryOptionsObject(hisopado);
          hisopado.galleryImages = new Array<NgxGalleryImage>();
          if (hisopado.ordenImagenes) {
            hisopado.ordenImagenes.forEach(function (ordenImagen) {
              hisopado.galleryImages.push(
                that.buildGalleryImage(ordenImagen.fullPath)
              );
            });
          }
        });
      },
      err => { this.isLoading = false; }
    );
  }

  getInformeCovidPdf(incidenteId: number) {
    this.operativaClientesService.getInformeCovidPdf(incidenteId).subscribe(data => {
      if (data !== undefined) {
        this.fileService.saveBuffer(data, 'informeCovid', FileService.PDF_TYPE);
      }
    });
  }

  openResultadoPdf(fullPath: string) {
    window.open(fullPath + '?time=' + new Date().getTime(), '_blank');
  }

  prevMonth(date: Date): Date {
    const thisMonth = date.getMonth();
    date.setMonth(thisMonth - 1);
    if ((date.getMonth() !== thisMonth - 1) && (date.getMonth() !== 11 || (thisMonth === 11 && date.getDate() === 1))) {
      date.setDate(0);
    }
    return date;
  }

  buildGalleryOptionsObject(hisopado: Hisopado): NgxGalleryOptions[] {
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
            titleText: 'Descarga',
            onClick: function (event, index) {
              const a = document.createElement('a');
              a.href = this.galleryImages[index].medium + '?time=' + new Date().getTime();
              a.download = 'descarga_1';
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
            }.bind(hisopado)
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

  // No se usa, problema con el indice.
  openGallery(pIndex: any) {
    this.query.forEach(function (value, index, array) {
      if (pIndex === index) {
        // si no refresca la imagen, modificar en: node_modules\@kolkov\ngx-gallery\__ivy_ngcc__\fesm5\kolkov-ngx-gallery.js
        // NgxGalleryPreviewComponent.prototype._show = function()
        // this.getSafeUrl(this.images[this.index]); ==> this.getSafeUrl(this.images[this.index] + '?time=' + new Date().getTime());
        // Si lo modificamos desde aca, falla la linea this.getFileType(this.images[this.index]);
        value.openPreview(0);
      }
    });
  }

  openGalleryByElement(element: Hisopado) {
    this.query.forEach(function (value, index, array) {
      if (element.galleryImages[0].big == value.bigImages[0]) {
        // si no refresca la imagen, modificar en: node_modules\@kolkov\ngx-gallery\__ivy_ngcc__\fesm5\kolkov-ngx-gallery.js
        // NgxGalleryPreviewComponent.prototype._show = function()
        // this.getSafeUrl(this.images[this.index]); ==> this.getSafeUrl(this.images[this.index] + '?time=' + new Date().getTime());
        // Si lo modificamos desde aca, falla la linea this.getFileType(this.images[this.index]);
        value.openPreview(0);
      }
    });
  }
}
