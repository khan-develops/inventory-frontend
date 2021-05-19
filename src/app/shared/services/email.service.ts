import { HttpClient } from '@angular/common/http';
import { ISpecialRequest } from 'src/app/shared/models/special-request.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
 baseUrl = 'http://localhost:3000/email'
  constructor(private _http: HttpClient) { }
  sendSrSpecialRequestEmail(specialRequestItems: any) {
    return this._http.post(this.baseUrl, specialRequestItems)
  }
}