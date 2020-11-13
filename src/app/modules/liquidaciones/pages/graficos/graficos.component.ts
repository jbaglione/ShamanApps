import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { FilterData } from '../../models/filter-data';
import { LiquidacionesService } from '../../liquidaciones.service';
import { PieItem } from '../../models/pie-item.model';
import { HorasMinutosHelper } from '@app/modules/shared/helpers/horasminutos';


@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent {
  filterData: FilterData;
  isLoading = false;
  cumplimiento = 0;
  condicionales = '';
  condicionalesTotal = 0;
  @Output() setIsLoadingEvent = new EventEmitter<boolean>();


  // Bar char
  public barChartLabels: Label[] = ['00/0000'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [0, 744], label: 'Horas Pactadas' },
    { data: [0, 744], label: 'Horas trabajadas' }
  ];

  // Pie char
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(255, 87, 51, 0.3)', 'rgba(155, 89, 182, 0.3)',
        'rgba(41, 128, 185, 0.3)', 'rgba(26, 188, 156, 0.3)', 'rgba(241, 196, 15, 0.3)', 'rgba(230, 126, 34, 0.3)', 'rgba(52, 73, 94, 0.3)']
    },
  ];
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };


  constructor(private liquidacionesService: LiquidacionesService) { }

  getData(filterData: FilterData = this.filterData) {
    this.barChartLabels = [this.GetPeriodoString(filterData.pPer.toString())];
    this.filterData = filterData;
    const that = this;
    that.isLoading = true;

    this.condicionalesTotal = 0;
    that.liquidacionesService
      .getAsistencia(filterData.pMov, filterData.pPer)
      .subscribe(asistencias => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);
        if (asistencias == null) {
          return;
        }

        let horasPactadas = 0;
        let horasTrabajadas = 0;
        let myPieChartLabels: PieItem[] = [];

        asistencias.forEach(asistencia => {
          horasPactadas += asistencia.horasPactadas;
          horasTrabajadas += asistencia.horasTrabajadas;

          if (asistencia.motivoDescuento && asistencia.motivoDescuento.trim().length > 0) {
            let nuevo = new PieItem(asistencia.motivoDescuento, asistencia.virEvlDescontable);
            let actual = myPieChartLabels.find(x => x.label == nuevo.label);
            if (actual) {
              actual.data += nuevo.data;
            } else {
              myPieChartLabels.push(nuevo);
            }
            this.condicionalesTotal += nuevo.data;
          }
        });

        this.cumplimiento = Math.round(((horasTrabajadas / horasPactadas) * 100 + Number.EPSILON) * 100) / 100;
        this.barChartData[0].data = [horasPactadas, 0, 744];
        this.barChartData[1].data = [horasTrabajadas, 0, 744];

        this.pieChartLabels = [];
        this.pieChartData = [];

        this.condicionales = HorasMinutosHelper.getInHours(this.condicionalesTotal).replace('.', ':');
        myPieChartLabels.forEach(item => {
          this.pieChartLabels.push(item.label);
          this.pieChartData.push(parseFloat(HorasMinutosHelper.getInHours(item.data)));
        });

      }, err => {
        that.isLoading = false;
        that.setIsLoadingEvent.emit(false);
      });
  }



  GetPeriodoString(pPer: string): string {
    let anio = pPer.substr(0, 4);
    let mes = pPer.substr(4, 2);
    return mes + '/' + anio;
  }

}
