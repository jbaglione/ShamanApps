import {Component, ViewEncapsulation} from '@angular/core';
import {ITooltipAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'tooltip-component',
    template: `
        <div class='custom-tooltip' *ngIf='isHeader'>
            <p>Nombre: {{params.value}}</p>
            <hr *ngIf='isGroupedHeader' />
            <div *ngIf='isGroupedHeader'>
                <p *ngFor='let header of params.colDef.children; let idx = index'>
                    Child {{(idx + 1)}} - {{header.headerName}}
                </p>
            </div>
        </div>
        <div class='custom-tooltip' *ngIf='!isHeader'>
            <p><span>Grado clasificación:</span></p><p>{{valueToDisplay}}</p>
        </div>`,
    styles: [
        `
            :host {
                position: absolute;
                width: 150px;
                height: 70px;
                border: 1px solid cornflowerblue;
                overflow: hidden;
                pointer-events: none;
                transition: opacity 1s;
            }

            :host.ag-tooltip-hiding {
                opacity: 0;
            }

            .custom-tooltip p {
                margin: 5px;
                white-space: nowrap;
            }

            .custom-tooltip p:first-of-type {
                font-weight: bold;
            }
        `
    ],
    styleUrls: ['./custom.tooltip.component.css']
})
export class CustomTooltip implements ITooltipAngularComp {

    private params: any;
    private valueToDisplay: string;
    private isHeader: boolean;
    private isGroupedHeader: boolean;

    agInit(params): void {
        this.params = params;
        this.isHeader = params.rowIndex === undefined;
        this.isGroupedHeader = !!params.colDef.children;
        this.valueToDisplay = params.value.value ? params.value.value : '- Missing -';
    }
}
