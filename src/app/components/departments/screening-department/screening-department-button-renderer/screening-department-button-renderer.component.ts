import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgRendererComponent, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ScreeningQuantityComponent } from 'src/app/components/admin/screening/screening-quantity/screening-quantity.component';
import { IScreening } from 'src/app/shared/models/screening.model';
import { ScreeningService } from 'src/app/shared/services/screening.service';

@Component({
  selector: 'app-screening-department-button-renderer',
  templateUrl: './screening-department-button-renderer.component.html',
  styleUrls: ['./screening-department-button-renderer.component.scss']
})
export class ScreeningDepartmentButtonRendererComponent implements AgRendererComponent, ICellRendererAngularComp {
  constructor(private dialog: MatDialog, private screeningService: ScreeningService) { }
  rowItem: IScreening;
  cellValue: number;
  params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params
    this.rowItem = params.node.data
    this.cellValue = Number(this.getValueToDisplay(params))
  }

  refresh(params: ICellRendererParams): any {
    this.cellValue = this.getValueToDisplay(params)
  }
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {rowItem: this.rowItem, cellValue: this.cellValue}
    const currentDialog = this.dialog.open(ScreeningQuantityComponent, dialogConfig)
    currentDialog.afterClosed().subscribe(() => this.params.context.screeningComponent.getScreeningQuantity())
  }
  buttonClicked() {
    this.openDialog()
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}

