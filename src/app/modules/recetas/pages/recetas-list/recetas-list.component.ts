import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { RecetasService } from '../../services/recetas.service';
import { CommonService } from '../../../shared/services/common.service';
import { Recetas } from '../../models/recetas.model';


@Component({
  selector: 'app-recetas-list',
  templateUrl: './recetas-list.component.html',
  styleUrls: ['./recetas-list.component.css']
})
export class ListRecetasComponent implements OnInit {

  dcRecetas: string[] = ['nroReceta', 'fecReceta', 'cliente', 'nroAfiliado', 'plan', 'nombre', 'diagnostico']; // , 'medico'
  mtRecetas: MatTableDataSource<Recetas>;
  userToken: string;
  rowid = -1;
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private recetasService: RecetasService,
    private commonService: CommonService,
    private router: Router) {
    commonService.setTitulo('Lista de Recetas');
  }

  ngOnInit() {
    this.GetRecetas();
  }

  private GetRecetas() {
    this.isLoading = true;
    this.recetasService.GetRecetas().subscribe(data => {
      let recetas: Recetas[] = [];
      data.forEach(element => {
        recetas.push(new Recetas(element));
      });
      this.mtRecetas = new MatTableDataSource(recetas);
      this.mtRecetas.paginator = this.paginator;
      this.mtRecetas.sort = this.sort;
      this.isLoading = false;
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }

    if (this.mtRecetas != null) {
      this.mtRecetas.filter = filterValue;
    }

  }

  verReceta(id: any) {
    this.router.navigate(['recetas/detail', id]);
  }

  onMouseOver(element) {
    this.rowid = element.id;
  }
}
