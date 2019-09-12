import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-moli',
  templateUrl: './moli.component.html'
})
export class MoliComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {

    activatedRoute.params.subscribe(params => {
      this.commonService.setTitulo('Moli');
    });
  }
}
