import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@app/modules/core/pages/not-found/not-found.component';
import { AuthGuard } from '@app/modules/security/helpers';
import { SecureLayoutComponent } from '@app/modules/core/layouts/secure-layout/secure-layout.component';
import { PublicLayoutComponent } from '@app/modules/core/layouts/public-layout/public-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: './modules/security/security.module#SecurityModule'
      }
    ]
  },
  {
    path: '',
    component: SecureLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: './modules/home/home.module#HomeModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'bitacoras',
        loadChildren: './modules/bitacoras/bitacora.module#BitacoraModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'afiliaciones',
        loadChildren: './modules/afiliaciones/afiliaciones.module#AfiliacionesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'actividadesclientes',
        loadChildren: './modules/actividades-clientes/actividades-clientes.module#ActividadesClientesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'electros',
        loadChildren: './modules/operativa-clientes/operativa-clientes.module#OperativaClientesModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'extranet-v1',
        loadChildren: './modules/extranet-v1/extranet-v1.module#ExtranetV1Module',
      },
      {
      path: 'moli',
      loadChildren: './modules/moli/moli.module#MoliModule',
      canActivate: [AuthGuard]
      },
      {
      path: 'facturacion',
      loadChildren: './modules/facturacion/facturacion.module#FacturacionModule',
      canActivate: [AuthGuard]
      },
      {
        path: 'auditoriasmoviles',
        loadChildren: './modules/auditorias-moviles/auditorias-moviles.module#AuditoriasMovilesModule',
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    // Averiguar
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
