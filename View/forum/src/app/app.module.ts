import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecentQuestionsComponent } from './recent-questions/recent-questions.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { DisplayQuestionComponent } from './display-question/display-question.component';
import { ProblemComponent } from './problem/problem.component';

import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TagInputModule } from 'ngx-chips';
import { TagListComponent } from './tag-list/tag-list.component';
import { ShareButtonModule } from '@ngx-share/button';
import { ShareButtonsModule } from '@ngx-share/buttons';

import { ClipboardModule } from 'ngx-clipboard';

import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';

// const shareProp = {
//   facebook: {
//     icon: faFacebookSquare
//   }
// };

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
    LinkedinLoginProvider
} from "angular-6-social-login";
import { SigninComponent } from './signin/signin.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        // {
        //   id: FacebookLoginProvider.PROVIDER_ID,
        //   provider: new FacebookLoginProvider("Your-Facebook-app-id")
        // },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("417663636575-alcebkhavihu6ju2oseeu372apd62cug.apps.googleusercontent.com")
        }
          // {
          //   id: LinkedinLoginProvider.PROVIDER_ID,
          //   provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
          // }
      ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    RecentQuestionsComponent,
    AskQuestionComponent,
    DisplayQuestionComponent,
    ProblemComponent,
    TagListComponent,
    SigninComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CKEditorModule,
    HttpClientModule,
    TagInputModule,
    FormsModule,
    ClipboardModule,
    SocialLoginModule,
    ShareButtonModule,
    ShareButtonsModule,//.withConfig({ prop: shareProp }),
    AppRoutingModule
  ],
  providers: [
    {
       provide: AuthServiceConfig,
       useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
