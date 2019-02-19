import { Component, OnInit } from '@angular/core';
import {AnswerData} from '../AnswerData'

import { ActivatedRoute } from "@angular/router";
import { HttpHandlerService } from "../http-handler.service";
import { TokenHandlerService } from "../token-handler.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import {Router} from '@angular/router';


@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {
  data:any[]=[];
  constructor(
              private http: HttpHandlerService,
              private router: Router,
              private route: ActivatedRoute
            ) {  }

  ngOnInit() {
    console.log("this is console inside tag list")
    var tag = this.route.snapshot.params['tag'];
    this.getTaggedQuestions(tag);
  }

  getTaggedQuestions(tag){
    this.data=[];
    var data ={ Tag: tag};
    this.http.post('forum/get_tagged_questions',data)
    .subscribe(res=>{
      for(var i=0;i<res.length;i++){
        this.data[i] = res[i];
        console.log(this.data[i])
      }
    });
  }

  getNewTaggedQuestions(tag){
  this.router.navigateByUrl('/tag-list/'+tag)
  this.getTaggedQuestions(tag);
  //this.ngOnInit();
  }

}
