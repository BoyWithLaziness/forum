import { Component} from '@angular/core';
import {TokenHandlerService} from './token-handler.service';
import {ActivatedRoute} from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{  
  constructor(private token:TokenHandlerService,
              private activatedRoute: ActivatedRoute) {

}

}
