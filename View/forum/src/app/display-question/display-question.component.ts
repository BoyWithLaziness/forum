import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpHandlerService } from "../http-handler.service";
import { TokenHandlerService } from "../token-handler.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { FormGroup,FormBuilder,Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons/faTwitterSquare';
import { faPinterest } from '@fortawesome/free-brands-svg-icons/faPinterest';

import {AnswerData} from '../AnswerData'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-display-question',
  templateUrl: './display-question.component.html',
  styleUrls: ['./display-question.component.css']
})
export class DisplayQuestionComponent implements OnInit {
  answerUsername:string;
  data:any;
  shareUrl:string;
  tagArray:TagData[]=[];
  public Editor = ClassicEditor;
  Id:string;
  questionId:string;
  answerForm:FormGroup;
  answerData:AnswerData[]=[];
  public name:string;
  noAnswer:boolean;
  index:number;

  constructor(private http: HttpHandlerService,
              private route: ActivatedRoute,
              private fb:FormBuilder,
              private token: TokenHandlerService,
              private toastr:ToastrService,
              private router:Router) { }

  ngOnInit() {
  this.shareUrl = 'http://127.0.0.1:4200'+this.router.url;
  console.log(this.shareUrl)

  this.Id = this.route.snapshot.paramMap.get("id");
  this.getQuestion();
  this.answerForm = this.fb.group({
    Answer:['',Validators.required]
  })

  }

  getQuestion() {
    this.http.post('forum/get_question',{Id:this.Id})
    .subscribe(res => {
      console.log(res);
      this.data = res;
      console.log("this is this.data",this.data);
      this.questionId  = this.data._id;
      this.getAnswers();
      for(var i=0;i<res.Tags.length;i++) {
        this.tagArray[i] = new TagData();
        this.tagArray[i].display = res.Tags[i];
        this.tagArray[i].value = res.Tags[i];
        this.tagArray[i].readonly = true;
      }

    },error=>{},()=>{})
  }

  addAnswer(){
    if(this.token.isTokenSet()) {
    if(this.answerForm.valid) {
    var data = this.answerForm.value;
    // var plainText = data.Answer.replace(/<[^>]*>/g, '');
    // data.Answer = plainText;
    this.token.getTokenValue()
    .subscribe(res => {
      console.log(res.Id);
      if(res.hasOwnProperty('Id')){
          this.name = res.Id;
      }
      else if(res.hasOwnProperty('Username')){
            this.name = res.Username;
      }



      data.Username = this.name;
      var token = this.token.getToken();
      data.QuestionID = this.data._id;
      data.DateString = new Date().toLocaleString();
      data.likesCount = 0;
      data.token = token;
      console.log("this is the final data",data);
      this.http.post('forum/add_answer',data)
      .subscribe(res=>{
        console.log("this is the response backk from addAnswer");
        console.log(res)
        this.toastr.success('You Answered this question');
        this.answerForm.patchValue({
          Answer:''
        });
        this.getAnswers();
      });
    });

  }
  else{
      this.toastr.warning('Empty Answer','Before submitting, please make sure you have typed in your answer');
  }
 }
 else {
   environment.previousPath = this.router.url;
   this.router.navigateByUrl('/login');
 }
 }//addanswer ends here


  getAnswers() {
    console.log("question id to send is ",this.questionId)
    this.http.post('forum/get_answers',{QuestionID:this.data._id})
    .subscribe(res => {
      if(res.length==0)
      {this.noAnswer = true;}
      else {
        this.noAnswer = false;
      }
      //console.log("this is answers docs",res);
      for(var i=0;i<res.length;i++){
        this.index = i ;
        this.answerData[i] = new AnswerData();
        this.answerData[i] = res[i];
      //this.answerData[i].Username = this.answerUsername;
      }
      console.log("this is the this.answerData",this.answerData);



    },error=>{},()=>this.getGoogleUsernames());

}

getGoogleUsernames(){

}



incrementLikeCount(AnswerID,likesCount){
    var token = this.token.getToken();
  if(this.token.isTokenSet()){

        var data = { AnswerID:AnswerID,
                     likesCount:likesCount,
                     token:token
                    }

        this.http.post('forum/is_liked',{AnswerID:AnswerID,token:token})
        .subscribe((res:any)=>{
          console.log('is liked or not',res)
          if(!res.status){
            console.log('LikedOrNot==0')
            console.log(data);
            this.http.post('forum/add_likes',data)
              .subscribe(res=> {
                  console.log(res);
                  this.getAnswers();
                  if(res.status){
                    var newdata ={AnswerID: AnswerID,token:token};
                    this.http.post('forum/change_like_status',newdata)
                    .subscribe(res=>{
                      console.log(res)
                    });
                  }
              });
          }
          else {
                console.log('LikedOrNot==1')
                
                this.http.post('forum/decrement_likes',data)
                .subscribe(res=>{
                    console.log(res);
                    this.getAnswers();

                    if(res.status){
                      var newData ={AnswerID: AnswerID,token:token};
                      this.http.post('forum/change_like_status',newData)
                        .subscribe(res=>{
                          console.log(res)
                        });
                      }
                });
          }


        });

  }
  else {
    environment.previousPath = this.router.url;
    this.router.navigateByUrl('/login');
  }
}

getTaggedQuestions(tag) {
  this.router.navigateByUrl('/tag-list/'+tag);
}

copyClicked(){
  this.toastr.info("You have copied link of this post!")
}

}

class TagData {
  display:string;
  value:string;
  readonly:boolean;
}
// var Id = this.answerData[i].Username
//     // this.http.post('forum/get_google_username',{Id:Id})
//     //   .subscribe(resp => {
//     //       array.push(resp);
//     //       this.answerUsername = resp.Name;
//     //   },error=>{},()=>{console.log('resp',array)})
