import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableLoadingService } from '../services/mat-table-loading.service';

@Component({
  selector: 'app-mat-table-loading',
  templateUrl: './mat-table-loading.component.html',
  styleUrls: ['./mat-table-loading.component.css']
})
export class MatTableLoadingComponent implements OnInit {
  activo$: Observable<boolean>;

  constructor(public matTableLoadingService: MatTableLoadingService) { }

  ngOnInit() {
    this.activo$ = this.matTableLoadingService.activo$;
  }

}
