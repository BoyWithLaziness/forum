import { Component, OnInit } from '@angular/core';
import {HttpHandlerService} from '../http-handler.service'

@Component({
  selector: 'app-recent-questions',
  templateUrl: './recent-questions.component.html',
  styleUrls: ['./recent-questions.component.css']
})
export class RecentQuestionsComponent implements OnInit {
  data:any[]=[];
  constructor(private http:HttpHandlerService) { }

  ngOnInit() {
  this.getQuestions();
  }

  getQuestions() {
      this.http.get('forum/get_questions')
      .subscribe(res => {
        console.log(res);
        this.data = res
      });
  }

}
