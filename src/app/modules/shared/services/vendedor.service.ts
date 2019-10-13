import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '@app/configs/app.config';
import { listable } from '@app/models/listable.model';
import { shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


    export class VendedorService {

    constructor(private http: HttpClient) { }

    private listUrl: string = AppConfig.endpoints.api + 'Vendedores';

    private vendedor$: Observable<listable[]>;


    getVendedores(): Observable<listable[]> {
        if (!this.vendedor$) {
            this.vendedor$ = this.http.get<listable[]>(this.listUrl).pipe(shareReplay());
        }

         // if products cache exists return it
        return this.vendedor$;
    }

    // Clear Cache
    clearCache() {
        this.vendedor$ = null;
    }
}
