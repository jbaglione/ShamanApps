import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '@app/configs/app.config';
import { Listable } from '@app/models/listable.model';
import { shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

    export class VendedorService {

    constructor(private http: HttpClient) { }

    private listUrl: string = AppConfig.settings.endpoints.api + 'Vendedores';

    private vendedor$: Observable<Listable[]>;


    getVendedores(): Observable<Listable[]> {
        if (!this.vendedor$) {
            this.vendedor$ = this.http.get<Listable[]>(this.listUrl).pipe(shareReplay());
        }

         // if products cache exists return it
        return this.vendedor$;
    }

    // Clear Cache
    clearCache() {
        this.vendedor$ = null;
    }
}
