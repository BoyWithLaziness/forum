import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import {TokenHandlerService} from '../token-handler.service';
import {HttpHandlerService} from '../http-handler.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Username:string;
  number:number;
  userKey:string;
  questionCount:number;
  answerCount:number;
  constructor(
              private token: TokenHandlerService,
              private route: Router,
              private toastr: ToastrService,
              private http: HttpHandlerService) { }

  ngOnInit() {
    this.getUsername();
    console.log(this.userKey)
    this.getQACount();
  }

  getQACount(){
    var token = this.token.getToken();

    this.token.getTokenValue()
    .subscribe(res=>{
      console.log("-----------------------------------------------------------------------------------------");
      console.log(res);
      console.log("-----------------------------------------------------------------------------------------");
      if(res.hasOwnProperty('Username')){

        this.http.post('forum/get_user_qa_info',{token:token})
        .subscribe(res=>{
          console.log('QA res',res)
          this.answerCount = res.A;
          this.answerCount = res.Q;
        })

    }
    else if(res.hasOwnProperty('Id')){
      this.http.post('forum/get_google_user_qa_info',{token:token})
      .subscribe(res=>{
        console.log('QA res',res)
        this.answerCount = res.A;
        this.answerCount = res.Q;
      })
    }
      });

    //
    // if(this.userKey=='Username'){
    //     this.http.post('forum/get_user_qa_info',{token:token})
    //     .subscribe(res=>{
    //       console.log('QA res',res)
    //       this.answerCount = res.A;
    //       this.answerCount = res.Q;
    //     })
    // }
    // else if(this.userKey=='Id'){
    //   this.http.post('forum/get_google_user_qa_info',{token:token})
    //   .subscribe(res=>{
    //     console.log('QA res',res)
    //     this.answerCount = res.A;
    //     this.answerCount = res.Q;
    //   })
    //
    // }

  }

getUsername(){
  console.log("-----------------------------------------------------------------------------------------");
  console.log('inside get username');
  console.log("-----------------------------------------------------------------------------------------");
  this.token.getTokenValue()
  .subscribe(res=>{
    console.log("-----------------------------------------------------------------------------------------");
    console.log(res);
    console.log("-----------------------------------------------------------------------------------------");
    if(res.hasOwnProperty('Username')){
    var name = res.Username;
    this.userKey = 'Username';
    this.Username = name;
  }
  else if(res.hasOwnProperty('Id')){
    var name = res.Id;
    this.Username = name;
    this.userKey = 'Id';
    this.getGoogleUser();
  }
    });

}
getGoogleUser(){
  var token = this.token.getToken();
    this.http.post('forum/get_google_user',{token:token})
    .subscribe(res=>{
      console.log('this is google user',res)
      this.Username = res[0].Name;
    })
}

}
