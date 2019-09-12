import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '@app/modules/security/models/usuario.model';
import { AppConfig } from '../configs/app.config';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Usuario[]>(`${AppConfig.endpoints.seguridad}`);//GetAll
    }
}
