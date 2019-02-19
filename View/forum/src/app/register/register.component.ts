import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {HttpHandlerService} from '../http-handler.service'

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  uniqueUsernameTruthValue:boolean;
  checkUsername:string;
  pattern = /^[A-z](?=.*[A-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-{}\\|[\];':",.<>/?`~]).{4,8}/;
  regex =  RegExp(this.pattern);
  constructor(
  private fb: FormBuilder,
  private route:Router,
  private http:HttpHandlerService,
  private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required,Validators.pattern('[A-z]+')]],
      password: ['', [Validators.required,
        Validators.pattern(this.regex),
        Validators.minLength(4),
        Validators.maxLength(8)
      ]
    ]

});
this.userName.valueChanges.subscribe(value => {
  this.checkUsername = value;
  this.checkUsernameUnique(this.checkUsername);
})
  }


  get email() {
    return this.registerForm.get('email');
  }

  get userName() {
    return this.registerForm.get('userName');
  }

  get password() {
    return this.registerForm.get('password');
  }



  addData(): void {
    if(this.registerForm.valid ) {
      var newFormData = this.formatData(this.registerForm.value);
      newFormData.LikedOrNot = {
        AnswerID:'null',
        Liked:0
      };
      this.http.post('forum/create_user/', newFormData)
      .subscribe(status => {
        console.log("THIS IS RESPONSE BACK FROM CREATE USER",status)
      });
      this.toastr.success("You have  registered successfully");
      this.route.navigateByUrl('/login')
    }


  }


  checkUsernameUnique(username): void {
    var data = {
      Username: username
    }
    console.log("inside checkUsernameUnique");
    this.http.post('forum/is_unique/', data)
    .subscribe(value => {
      this.uniqueUsernameTruthValue = value.status;
      //console.log("Boolean Value return is " + value);
    });
  }


  formatData(data): any {
    return {
    Email: data.email,
    Username: data.userName,
    Password: data.password,
  }

  }


}
