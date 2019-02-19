import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import {TokenHandlerService} from './token-handler.service'

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private token:TokenHandlerService,
              private route:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.token.isTokenSet()){
      this.route.navigateByUrl('/dashboard');
      return false;
    }
    else {
      return true;
    }
  }

}
