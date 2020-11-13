import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/modules/shared/services/common.service';
import { FilterData } from './models/filter-data';
import { PrestacionesComponent } from './pages/prestaciones/prestaciones.component';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FilterComponent } from './components/filter/filter.component';
import { AsistenciaComponent } from './pages/asistencia/asistencia.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { ProgressBarService } from '../shared/services/progress-bar.service';


@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html'
})
export class LiquidacionesComponent {

  filterData: FilterData;
  esEmpresa: boolean;
  isLoading = false;
  isLoadingPresentaciones = false;
  isLoadingResumen = false;
  isLoadingAsistencia = false;
  isLoadingGraficos = false;

  @ViewChild(PrestacionesComponent)
  private prestacionesComponent: PrestacionesComponent;

  @ViewChild(ResumenComponent)
  private resumenComponent: PrestacionesComponent;

  @ViewChild(AsistenciaComponent)
  private asistenciaComponent: AsistenciaComponent;

  @ViewChild(GraficosComponent)
  private graficosComponent: GraficosComponent;

  @ViewChild(FilterComponent)
  private filterComponent: FilterComponent;
  showComponent: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private progressBarService: ProgressBarService
  ) {
    // activatedRoute.params.subscribe(params => {
    //   this.commonService.setTitulo('Liquidaciones');
    // });
    activatedRoute.params.subscribe(params => {
      this.esEmpresa = params['modo'] == 'empresas';
      this.showComponent = false;
      setTimeout(() => {
        this.showComponent = true;
      }, 100);
    });
  }

  getData(filterData: FilterData = this.filterData) {
    this.isLoading = true;
    this.isLoadingResumen = true;
    this.isLoadingAsistencia = true;
    this.isLoadingGraficos = true;

    this.prestacionesComponent.getData(filterData);
    this.resumenComponent.getData(filterData);

    if (!this.esEmpresa) {
      this.isLoadingAsistencia = true;
      this.asistenciaComponent.getData(filterData);
      this.graficosComponent.getData(filterData);
    }
  }

  exportToExcel() {
    this.prestacionesComponent.exportToExcel();
  }
  applyFilter(filter: string) {
    this.prestacionesComponent.applyFilter(filter);
  }

  setIsLoadingPresentaciones(isLoading: boolean) {
    this.isLoadingPresentaciones = isLoading;
    this.setIsloading();
  }

  setIsLoadingResumen(isLoading: boolean) {
    this.isLoadingResumen = isLoading;
    this.setIsloading();
  }

  setIsLoadingAsistencia(isLoading: boolean) {
    this.isLoadingAsistencia = isLoading;
    this.setIsloading();
  }
  setIsLoadingGraficos(isLoading: boolean) {
    this.isLoadingGraficos = isLoading;
    this.setIsloading();
  }
  setIsWorkingEvent(isWorking: boolean) {
    // TODO: llamar desde cada modulo. no asi.
    if (isWorking) {
      this.progressBarService.activarProgressBar();
    } else {
      this.progressBarService.desactivarProgressBar();
    }
  }

  private setIsloading() {
    if (this.esEmpresa) {
      this.isLoading = this.isLoadingResumen || this.isLoadingPresentaciones;
    } else {
      this.isLoading = this.isLoadingResumen || this.isLoadingPresentaciones || this.isLoadingAsistencia || this.isLoadingGraficos;
    }
  }

  selectedTabChange(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    this.filterComponent.setVisibilityControls(tabChangeEvent.index);
  }
}
