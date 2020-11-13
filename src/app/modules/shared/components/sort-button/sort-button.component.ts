import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SortItem } from '../../models/sort-item.model';
import { Sort } from '../../models/e-sort.model';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.css']
})
export class SortButtonComponent implements OnInit {
  @Input() sortItems: SortItem[];
  @Output() sortItemSelectedOutput = new EventEmitter<SortItem>();
  matIcon: string;

  constructor() { }

  ngOnInit() {
    this.sortItems.forEach(si => {
      this.setIcon(si);
    });
  }

  sort_click(sortItem: SortItem) {
    let sortItemOldSelected: SortItem = this.sortItems.find(si => si.sort != null);

    if (sortItemOldSelected.field == sortItem.field) {
      sortItemOldSelected.sort = (sortItemOldSelected.sort == Sort.Asc) ? Sort.Desc : Sort.Asc;
      this.setIcon(sortItemOldSelected);
      this.sortItemSelectedOutput.emit(sortItemOldSelected);
    } else {
      sortItemOldSelected.sort = null;
      this.setIcon(sortItemOldSelected);
      let sortItemNewSelected: SortItem = this.sortItems.find(si => si.field == sortItem.field);
      sortItemNewSelected.sort = Sort.Asc;
      this.setIcon(sortItemNewSelected);
      this.sortItemSelectedOutput.emit(sortItemNewSelected);
    }
  }

  setIcon(sortItem: SortItem) {
    if (sortItem.sort == Sort.Asc) {
      sortItem.matIcon = 'arrow_upward';
    } else if (sortItem.sort == Sort.Desc) {
      sortItem.matIcon = 'arrow_downward';
    } else {
      sortItem.matIcon = '';
    }
  }
}
