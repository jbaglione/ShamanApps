import { FormControl } from '@angular/forms';
import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HisopadosPacientesService } from '../../hisopados-pacientes.service';
import { HisopadoPaciente } from '../../models/hisopado-paciente.model';
import { ConstanciaAtencionReq } from '../../models/constancia-atencion-req';
import { CommonService } from '@app/modules/shared/services/common.service';
import { Observable } from 'rxjs';
import { FileService } from '@app/modules/shared/services/files.service';
import { NgxGalleryImage, NgxGalleryComponent, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { DateHelper } from '@app/modules/shared/helpers/DateHelper';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';

@Component({
  selector: 'app-hisopados-pacientes',
  templateUrl: './hisopados-pacientes.component.html',
  styleUrls: ['./hisopados-pacientes.component.css']
})

export class HisopadosPacientesComponent implements OnInit {
  // Filtros para busqueda
  desde: FormControl;
  hasta: FormControl;
  descripcionInput: FormControl;

  hisopados$: Observable<HisopadoPaciente[]>;

  // Datos para grilla
  isLoading = false;
  infoMessage = '';
  dcHisopadosPacientes: string[] = [
    'nroIncidente',
    'fecIncidente',
    'sintoma',
    'diagnostico',
     'archivo',
  ];

  mtHisopadosPacientes: MatTableDataSource<HisopadoPaciente> = new MatTableDataSource();
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
    private operativaClientesService: HisopadosPacientesService,
    private commonService: CommonService,
    public dialog: MatDialog,
    public fileService: FileService,
    private progressBarService: ProgressBarService
  ) {
    this.commonService.setTitulo('Gestión de HisopadosPacientes');
  }

  ngOnInit() {
    this.desde = new FormControl(DateHelper.prevMonth(new Date(), 3));
    this.hasta = new FormControl(new Date());
    this.descripcionInput = new FormControl();
    this.getHisopadosPacientes();
  }

  setDataSourceAttributes() {
    this.mtHisopadosPacientes.paginator = this.paginator;
    this.mtHisopadosPacientes.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.mtHisopadosPacientes.filter = filterValue;
  }

  getHisopadosPacientes() {
    const that = this;
    that.isLoading = true;
    // PDFResultado: \\archivos02\shamanAdj$\Incidendes\(20200730\10088981_2.pdf)
    that.hisopados$ = that.operativaClientesService.getHisopadosPacientes(this.desde.value, this.hasta.value);
    that.hisopados$.subscribe(
      hisopadosPacientes => {
        if (hisopadosPacientes == null) {
          return;
        }
        that.isLoading = false;
        this.mtHisopadosPacientes = new MatTableDataSource(hisopadosPacientes);
        this.setDataSourceAttributes();

        hisopadosPacientes.forEach(function (hisopado) {
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

  buildGalleryOptionsObject(hisopado: HisopadoPaciente): NgxGalleryOptions[] {
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

  openGalleryByElement(element: HisopadoPaciente) {
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

  downloadConstanciaAtencion(element: HisopadoPaciente) {
    let req = new ConstanciaAtencionReq();
    req.serial = '4678913118';
    req.pacienteFullname = element.pacienteFullName.trim();
    req.diagnosticDescription = element.diagnostico;
    req.treatment = element.tratamiento;
    req.pacienteEmail = '';
    req.fechaAtencion = DateHelper.dateToAnsi(element.fecIncidente);
    this.progressBarService.activarProgressBar('Descargando constancia de atención...');
    this.operativaClientesService.downloadConstanciaAtencion(req).subscribe(resp => {
        this.progressBarService.desactivarProgressBar();
        this.infoMessage = '';
        let fileName = this.fileService.getFileNameFromHeader(resp.headers);
        this.fileService.saveBuffer(resp.body, fileName, FileService.PDF_TYPE, true);
      });
  }
}
