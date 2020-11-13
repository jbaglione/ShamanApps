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
import { SafePipe } from './pipes/safe.pipe';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatTableLoadingComponent } from './mat-table-loading/mat-table-loading.component';
import { MatTableNotFoundComponent } from './mat-table-not-found/mat-table-not-found.component';
import { IsEllipsisActiveDirective } from './directives/is-ellipsis-active.directive';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { GoogleButtonComponent } from './components/google-button/google-button.component';

@NgModule({
  declarations: [
    DialogComponent,
    SafePipe,
    SafeHtmlPipe,
    SpinnerComponent,
    ProgressBarComponent,
    MatTableLoadingComponent,
    MatTableNotFoundComponent,
    SortButtonComponent,
    GoogleButtonComponent,
    IsEllipsisActiveDirective],
  imports: [LayoutModule,
    CdkTableModule,
    MaterialModule,
    RouterModule,
    CommonModule],
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
    SafeHtmlPipe,
    SpinnerComponent,
    ProgressBarComponent,
    MatTableLoadingComponent,

    MatTableNotFoundComponent,
    SortButtonComponent,
    GoogleButtonComponent,
    IsEllipsisActiveDirective
  ],
  entryComponents: [DialogComponent]
})
export class SharedModule { }
