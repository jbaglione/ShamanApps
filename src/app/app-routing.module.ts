import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@app/modules/core/pages/not-found/not-found.component';
import { AuthGuard } from '@app/modules/security/helpers';
import { SecureLayoutComponent } from '@app/modules/core/layouts/secure-layout/secure-layout.component';
import { PublicLayoutComponent } from '@app/modules/core/layouts/public-layout/public-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/mensajeria/mensajes', pathMatch: 'full' },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./modules/security/security.module').then(m => m.SecurityModule)
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
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'hallazgos',
        loadChildren: () => import('./modules/bitacoras/bitacora.module').then(m => m.BitacoraModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'bitacoras',
        loadChildren: () => import('./modules/bitacoras/bitacora.module').then(m => m.BitacoraModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'afiliaciones',
        loadChildren: () => import('./modules/afiliaciones/afiliaciones.module').then(m => m.AfiliacionesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'actividadesclientes',
        loadChildren: () => import('./modules/actividades-clientes/actividades-clientes.module').then(m => m.ActividadesClientesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'electros',
        loadChildren: () => import('./modules/operativa-clientes/operativa-clientes.module').then(m => m.OperativaClientesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'extranet-v1',
        loadChildren: () => import('./modules/extranet-v1/extranet-v1.module').then(m => m.ExtranetV1Module),
      },
      {
        path: 'moli',
      loadChildren: () => import('./modules/moli/moli.module').then(m => m.MoliModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'facturacion',
      loadChildren: () => import('./modules/facturacion/facturacion.module').then(m => m.FacturacionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'mensajeria',
        loadChildren: () => import('./modules/mensajeria/mensajeria.module').then(m => m.MensajeriaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./modules/configuracion/configuracion.module').then(m => m.ConfiguracionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'preincidentes',
        loadChildren: () => import('./modules/preincidentes-clientes/preincidentes-clientes.module')
        .then(m => m.PreIncidentesClientesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'liquidaciones',
        loadChildren: () => import('./modules/liquidaciones/liquidaciones.module').then(m => m.LiquidacionesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'recetas',
        loadChildren: () => import('./modules/recetas/recetas.module').then(m => m.RecetaModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'hisopados',
        loadChildren: () => import('./modules/hisopados/hisopados.module').then(m => m.HisopadosModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'pacientes-covid',
        loadChildren: () => import('./modules/pacientes-covid/pacientes-covid.module').then(m => m.PacientesCovidModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'hisopados-pacientes',
        loadChildren: () => import('./modules/hisopados-pacientes/hisopados-pacientes.module').then(m => m.HisopadosPacientesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paneloperativo',
        loadChildren: () => import('./modules/panel-operativo/panel-operativo.module').then(m => m.PanelOperativoModule),
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
