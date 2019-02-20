import { Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { FormGroup,FormBuilder,Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Observable} from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import {Router} from '@angular/router';
import {HttpHandlerService} from '../http-handler.service'
import {TokenHandlerService} from '../token-handler.service'

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TagInputModule} from 'ngx-chips';


@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  askQuestionForm:FormGroup
  public Editor = ClassicEditor;

  public items = [''];

  constructor(private fb:FormBuilder,
              private token:TokenHandlerService,
              private http: HttpHandlerService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.askQuestionForm = this.fb.group({
        Title:['',Validators.required],
        Description:['',Validators.required],
        Tags:[Validators.required]

    });
    
    this.getTags();

  }

  //Form control Getters
  get Title() {
  return this.askQuestionForm.get('Title');
  }

  get Description() {
  return this.askQuestionForm.get('Descritpion');
  }

  get Tags() {
  return this.askQuestionForm.get('Tags');
  }
  save(tag):void {

  }

  getTags(){
    var token = this.token.getToken();
    this.http.post('forum/get_tags',{token:token})
    .subscribe(res=>{
      this.items =  res;
      console.log(res)
    })
  }
  loadData():void {
    if(this.askQuestionForm.valid){
      var data = this.askQuestionForm.value;
      // var plainText = data.Description.replace(/<[^>]*>/g, '');
      var tagsArray = []
       for(var i=0;i<data.Tags.length;i++)  {
          tagsArray[i]=data.Tags[i].value;
       }
      //data.Description = plainText;
      data.Tags =  tagsArray;
      var token = this.token.getToken();
      data.token = token;
      data.DateString = new Date().toLocaleString();
      this.http.post('forum/add_question',data)
      .subscribe(res =>{
        console.log(res)
        this.toastr.success("You have asked your question!")
        this.router.navigateByUrl('/dashboard')
      })
      console.log(data)
  }
  else {
    this.toastr.warning("Wrong","Please add your question details before submitting");
  }
}
}
