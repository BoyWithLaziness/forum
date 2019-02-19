import { Component, OnInit } from '@angular/core';
import {TokenHandlerService} from '../token-handler.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  items:string[];
  
  constructor(private token:TokenHandlerService) { }

  ngOnInit() {
    this.setNavOptions();
  }

  setNavOptions(){
    if(this.token.isTokenSet()){
      this.items = ['Dashboard'];
    }
    else {
      this.items =['Login','Register'];
    }
  }

}
