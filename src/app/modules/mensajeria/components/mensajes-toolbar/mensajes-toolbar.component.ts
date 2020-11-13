import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Sort } from '@app/modules/shared/models/e-sort.model';
import { SortItem } from '@app/modules/shared/models/sort-item.model';

@Component({
  selector: 'app-mensajes-toolbar',
  templateUrl: './mensajes-toolbar.component.html',
  styleUrls: ['./mensajes-toolbar.component.css']
})
export class MensajesToolbarComponent implements OnInit {
  @Output() refreshOutput = new EventEmitter<void>();
  @Output() sortItemOutput = new EventEmitter<SortItem>();

  sortItems: SortItem[] = <SortItem[]>[
    { field: 'fecha', sort: Sort.Asc },
    { field: 'emisor' }
  ];

  constructor() {}

  ngOnInit() {}

  refresh_click() {
    this.refreshOutput.emit();
  }

  setSortItem($event) {
   this.sortItemOutput.emit($event);
  }
}
