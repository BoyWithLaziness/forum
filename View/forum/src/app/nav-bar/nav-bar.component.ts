import { Component, OnInit } from '@angular/core';
import {TokenHandlerService} from '../token-handler.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  items:string[];
  isLoggedIn:boolean;
  constructor(private token:TokenHandlerService,
              private toastr: ToastrService,
              private route: Router) { }

  ngOnInit() {
    this.setNavOptions();
  }

  setNavOptions(){
    if(this.token.isTokenSet()){
      this.items = ['Dashboard'];
      this.isLoggedIn = true;
    }
    else {
      this.items =['Login','Register'];
      this.isLoggedIn = false;
    }
  }

  logout(){
    this.token.removeToken();
    this.toastr.info("You are logged out!")
    this.route.navigateByUrl('/home');
  }

}
