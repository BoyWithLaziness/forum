import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DisplayQuestionComponent} from './display-question/display-question.component';
import {AskQuestionComponent} from './ask-question/ask-question.component';
import {RecentQuestionsComponent} from './recent-questions/recent-questions.component';
import {ProblemComponent} from './problem/problem.component';
import {TagListComponent}  from "./tag-list/tag-list.component";

import {LoginGuard}  from "./login.guard";
import {DashboardGuard}  from "./dashboard.guard";

const routes: Routes = [
                        {path: '', redirectTo: '/home', pathMatch: 'full' },
                        {path:'home',component:HomeComponent},
                        {path:'login',component:LoginComponent,canActivate:[DashboardGuard]},
                        {path:'register',component:RegisterComponent},
                        {path:'dashboard',component:DashboardComponent,canActivate:[LoginGuard]},
                        {path:'display-question/:id',component:DisplayQuestionComponent},
                        {path:'ask-question',component:AskQuestionComponent,canActivate:[LoginGuard]},
                        {path:'recent-questions',component:RecentQuestionsComponent},
                        {path:'tag-list/:tag',component:TagListComponent},
                        {path:'**',component:ProblemComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
