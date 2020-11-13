import { NgModule } from '@angular/core';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { SharedModule } from '@app/modules/shared/shared.module';
import { UploadModule } from '@app/modules/upload/upload.module';
import { RecetaDetailComponent } from './pages/receta-detail/receta-detail.component';
import { ListRecetasComponent } from './pages/recetas-list/recetas-list.component';
import { RecetaRoutingModule } from './recetas-routing.module';
import { RecetasService } from './services/recetas.service';
import { MedicamentosListComponent } from './components/medicamentos-list/medicamentos-list.component';
import { MedicamentosSearchComponent } from './components/medicamentos-search/medicamentos-search.component';
import { ClientesIntegrantesSearchComponent } from './components/clientes-integrantes-search/clientes-integrantes-search.component';
import { ClientesIntegrantesService } from './services/clientes-integrantes.service';
import { MedicamentosDialogComponent } from './components/medicamentos-dialog/medicamentos-dialog.component';

@NgModule({
  declarations: [
    RecetaDetailComponent,
    ListRecetasComponent,
    MedicamentosListComponent,
    MedicamentosSearchComponent,
    ClientesIntegrantesSearchComponent,
    MedicamentosDialogComponent
  ],
  imports: [
    SharedModule,
    UploadModule,
    RecetaRoutingModule,
    NgxGalleryModule,
  ],
  exports: [
    RecetaDetailComponent,
    ListRecetasComponent,
    MedicamentosListComponent,
    MedicamentosSearchComponent,
    ClientesIntegrantesSearchComponent,
    MedicamentosDialogComponent
  ],
  providers: [RecetasService, ClientesIntegrantesService]
})
export class RecetaModule { }
