import { Component, OnInit, ViewChild } from '@angular/core';
import { IMaster } from '../../../shared/models/master.model';
import { AgGridAngular } from 'ag-grid-angular'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { FormComponent } from '../../forms/new-item-form/form.component';
import { MasterService } from '../../../shared/services/master.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  baseUrl = 'http://localhost:3000/master'
  isSpecialRequest: boolean = false
  isDeleteButtonDisabled: boolean = true;
  isAssignButtonDisabled: boolean = true;
  selectedItem: IMaster;
  searchValue: string;
  editText: string = 'Start Editing';
  gridApi: any;
  gridColumnApi: any;
  defaultColDef: any;
  columnDefs: any;
  rowData: any;

  constructor(private dialog: MatDialog, private _masterService: MasterService) { }

  ngOnInit(): void {
    this.getMasterInventory()
    this.defaultColDef = { 
      resizable: true,
      sortable: true,
      filter: true
    }
    this.handleEditing()
  }
  getMasterInventory(): void {
    this._masterService.getMasterItems().subscribe(response => this.rowData = response)
  }
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    const currentDialog = this.dialog.open(FormComponent, dialogConfig)
    currentDialog.afterClosed().subscribe(result => 
      this.getMasterInventory()
    )
  }
  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const getSelectedData = selectedNodes.map(node => {
      this.selectedItem = node.data
    })
    if(getSelectedData.length > 0) {
      this.isDeleteButtonDisabled = false
      this.isAssignButtonDisabled = false
    } else {
      this.isDeleteButtonDisabled = true
      this.isAssignButtonDisabled = true
    }

  }
  handleEditing(isEditing: boolean = false) {
    this.columnDefs = [
      {headerName: 'ID', field: 'ID', minWidth: 100, maxWidth: 110, checkboxSelection: true},
      {headerName: 'Item', field: 'Item', editable: isEditing},
      {headerName: 'Purchase Unit', field: 'Purchase_Unit', editable: isEditing},
      {headerName: 'Manufacturer', field: 'Manufacturer', maxWidth: 200, editable: isEditing},
      {headerName: 'Part Number', field: 'Part_Number', maxWidth: 140, editable: isEditing},
      {headerName: 'Recent CN', field: 'Recent_CN', maxWidth: 140, editable: isEditing},
      {headerName: 'Recent Vendor', field: 'Recent_Vendor', editable: isEditing},
      {headerName: 'Fisher CN', field: 'Fisher_CN', maxWidth: 140, editable: isEditing},
      {headerName: 'VWR CN', field: 'VWR_CN', maxWidth: 140, editable: isEditing},
      {headerName: 'Lab Source CN', field: 'Lab_Source_CN', minWidth: 140, editable: isEditing},
      {headerName: 'Next Advance CN', field: 'Next_Advance_CN', minWidth: 140, editable: isEditing},
      {headerName: 'Average Unit Price', field: 'Average_Unit_Price', minWidth: 140, editable: isEditing},
      {headerName: 'Category', field: 'Category', minWidth: 150, editable: isEditing},
      {headerName: 'Comments', field: 'Comments', minWidth: 150, editable: isEditing},
      {headerName: 'Type', field: 'Type', maxWidth: 140, editable: isEditing},
      {headerName: 'Class', field: 'Class', maxWidth: 140, editable: isEditing},
    ]
  }
  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }
  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }
  autoSizeAll(skipHeader: any) {
    var allColumnIds: any[] = [];
    this.gridColumnApi.getAllColumns().forEach(function (column: { colId: any; }) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  handleSearch(value: string) {
    this.gridApi.setQuickFilter(value);
  }
  handleAssign(departmentName: string, isSpecialRequest: boolean = false) {
    this._masterService.updateMasterItem(this.selectedItem.ID, this.selectedItem, departmentName, isSpecialRequest).subscribe(response => response)
    this.isDeleteButtonDisabled = true
    this.isAssignButtonDisabled = true
    this.gridApi.deselectAll();
  }
  handleUpdate(value: any) {
    this._masterService.updateMasterItem(value.data.ID , value.data, '').subscribe({
      next: data => console.log(data),
      error: error => {
        console.error(error)
      }
    })
  }
  handleDelete() {
    this._masterService.deleteMasterItem(this.selectedItem.ID).subscribe({
      next: data => {
        this.getMasterInventory()
      },
      error: error => {
        console.error(error)
        this.getMasterInventory()
      }
    })
    this.isDeleteButtonDisabled = true
    this.isAssignButtonDisabled = true
  }
  onSearchClear() {
    this.searchValue = ''
  }
  toggleEditMode() {
    if(this.editText === 'Start Editing') {
      this.autoSizeAll(false);
      this.editText = 'Stop Editing';
      this.handleEditing(true) 
    } else {
      this.sizeToFit()
      this.editText = 'Start Editing'
      this.handleEditing() 
    }
      
  }
}
