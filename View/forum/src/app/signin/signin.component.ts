import { Component, OnInit } from '@angular/core';

import {
    AuthService,
    FacebookLoginProvider,
    GoogleLoginProvider,
    LinkedinLoginProvider
} from 'angular-6-social-login';

import {ToastrService} from "ngx-toastr";

import {Router} from '@angular/router';

import {HttpHandlerService} from '../http-handler.service'
import {TokenHandlerService} from '../token-handler.service'


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  userData:any;
  data:any;

  truthValue:boolean
  constructor( private socialAuthService: AuthService,
               private http: HttpHandlerService,
               private router: Router,
               private toastr: ToastrService,
               private token: TokenHandlerService) { }

  ngOnInit() {
  }
  public socialSignIn(socialPlatform : string) {
      let socialPlatformProvider;
      if(socialPlatform == "facebook"){
        socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
      }else if(socialPlatform == "google"){
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
      } else if (socialPlatform == "linkedin") {
        socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
      }

      this.socialAuthService.signIn(socialPlatformProvider).then(
        (res) => {
          this.userData = res;
          console.log(socialPlatform+" sign in data : " , this.userData);
          this.data ={
            Email: this.userData.email,
            Id: this.userData.id,
            IdToken: this.userData.idToken,
            Image: this.userData.image,
            Name: this.userData.name,
            Token: this.userData.token,
            AnswersLiked:[]
          }
          this.ifUserExists(this.userData.id);
        }
      );
    }

    ifUserExists(id):any{
      this.http.post('forum/google_user_exists',{Id:id})
       .subscribe(res=> {
         console.log(res)

          if(res.status) {
            console.log('************************LOGIN********************')
            this.login(this.userData.id);
          }
          else {
            console.log('********************CREATE************************')
              this.create(this.data);
          }
       })

    }


    login(id){
      this.http.post('forum/google_login',{Id: id})
      .subscribe(res=>{
          this.token.setToken(res.token);
          this.router.navigateByUrl('/dashboard');
      })
    }

    create(data) {

    this.http.post('forum/google_create',data)
    .subscribe(res=>{
      console.log(res)
     console.log("google account created",res.Id);

     this.login(res.Id);
     });

   }

}
