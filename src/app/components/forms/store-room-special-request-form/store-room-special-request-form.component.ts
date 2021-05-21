import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISpecialRequest } from 'src/app/shared/models/special-request.model';
import { IUser } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { SpecialRequestService } from 'src/app/shared/services/special-request.service';

@Component({
  selector: 'app-store-room-special-request-form',
  templateUrl: './store-room-special-request-form.component.html',
  styleUrls: ['./store-room-special-request-form.component.scss']
})
export class StoreRoomSpecialRequestFormComponent implements OnInit {
  currentUser: IUser
  specialRequestItem: any
  specialRequestForm = new FormGroup({
    Quantity: new FormControl('', [Validators.required]),
  })
  constructor(private _specialRequestService: SpecialRequestService, 
              private dialog: MatDialogRef<StoreRoomSpecialRequestFormComponent>, 
              private _dataService: DataService,
              @Inject(MAT_DIALOG_DATA) 
              public data: any,
              private authService: AuthService) { 
    this.specialRequestItem = data
  }
  ngOnInit() {
    this.currentUser = this._dataService.getUser()
  }
  onSubmit() {
    const data: ISpecialRequest = {
      ID: this.specialRequestItem.ID,
      Quantity: Number(this.specialRequestForm.value.Quantity),
      Item_ID: this.specialRequestItem.Item_ID,
      Department: this.currentUser.department,
      User: this.currentUser.name,
      Is_Confirmed: false,
      Is_Store_Room_Item: true
    }
    this._specialRequestService.createSpecialRequestItem(data).subscribe(response => console.log(response))
    this.onClose()
  }
  onClose() {
    this.dialog.close()
  }
}
