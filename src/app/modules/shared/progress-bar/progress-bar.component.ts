import { Component, OnInit, Input } from '@angular/core';
import { ProgressBarService } from '../services/progress-bar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input()  topbar = 79;
  pbColor = 'primary';
  pbMode = 'indeterminate';
  pbBufferValue = 75;
  public activa$: Observable<boolean>;

  constructor(public progressBarService: ProgressBarService) { }

  ngOnInit() {
     this.activa$ = this.progressBarService.activar$;
  }

}
