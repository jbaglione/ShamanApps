import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { DialogComponent } from './dialog/dialog.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SafePipe } from './helpers/safe.pipe';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatTableLoadingComponent } from './mat-table-loading/mat-table-loading.component';
import { MatTableNotFoundComponent } from './mat-table-not-found/mat-table-not-found.component';


@NgModule({
  declarations: [DialogComponent, SafePipe, SpinnerComponent, ProgressBarComponent, MatTableLoadingComponent, MatTableNotFoundComponent],
  imports: [LayoutModule, CdkTableModule, MaterialModule, RouterModule, CommonModule],
  exports: [
    LayoutModule,
    CdkTableModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DialogComponent,
    SafePipe,
    SpinnerComponent,
    ProgressBarComponent,
    MatTableLoadingComponent,
    MatTableNotFoundComponent
  ],
  entryComponents: [DialogComponent]
})
export class SharedModule {}
