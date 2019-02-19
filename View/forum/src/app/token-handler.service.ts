import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';
import {HttpHandlerService} from './http-handler.service'
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenHandlerService {

  constructor(private http:HttpHandlerService) { }

  setToken(value):void{
    localStorage.setItem('token',value);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

getTokenValue(): Observable<any>{

  if(this.isTokenSet()){
    var tokenValue =this.getToken();
    return this.http.post('forum/get_token_value',{token:tokenValue})
  }

}
  isTokenSet():boolean {
      if (localStorage.getItem("token") === null) {
        return false;
      }
      else {
        return true;
      }

}
}
