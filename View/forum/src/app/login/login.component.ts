import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpHandlerService} from '../http-handler.service'
import {TokenHandlerService} from '../token-handler.service'
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
  constructor(
  private fb:FormBuilder,
  private router:Router,
  private http:HttpHandlerService,
  private token:TokenHandlerService,
  private toastr: ToastrService) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
        userName : ['',Validators.required],
        password : ['',Validators.required]
      });
  }


  get userName(){
    return this.loginForm.get('userName');
  }

  get password(){
    return this.loginForm.get('password');
  }

  checkCredentials(username,password):void {
    var data = {
      Username:username,
      Password:password
    }
    console.log("this is inside login component ts",data);
    this.http.post('forum/login/',data)
    .subscribe(value  => {
      console.log(value);

      if(value.status) {
        console.log("this is data.username")
        this.token.setToken(value.token);
        console.log(data.Username);
        if(environment.previousPath!=''){
          this.router.navigateByUrl(environment.previousPath);
        }
        else {
        this.router.navigateByUrl(`/dashboard` );
      }
      }
      else {
        this.toastr.warning('(ಠ_ಠ)', 'Sorry, wrong credentials');
        console.log("not logged in")
      }
    });
  }


}
