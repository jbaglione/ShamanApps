import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mat-table-not-found',
  templateUrl: './mat-table-not-found.component.html',
  styleUrls: ['./mat-table-not-found.component.css']
})
export class MatTableNotFoundComponent implements OnInit {
  @Input() activo = false;

  constructor() { }

  ngOnInit() {
  }

}
