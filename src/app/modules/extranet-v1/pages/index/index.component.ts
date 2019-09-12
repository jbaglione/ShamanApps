import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { CommonService } from '@app/services/common.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public page = '';
  public urlPageTrusted: SafeUrl;

  constructor(private activateRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.page = this.activateRoute.snapshot.params['page'];
      const micrositioV1 = this.authenticationService.currentUserValue.micrositiosV1.find(m => m.codigo.toString() == this.page);
      this.commonService.setTitulo(micrositioV1.titulo);
      const urlPage = micrositioV1.urlV1;
      const token = this.authenticationService.currentUserValue.tokenInfo.accessToken;
      this.urlPageTrusted = urlPage + (urlPage.includes('?') ? '&' : '?') +  'token=' + token;
    });
  }
}
