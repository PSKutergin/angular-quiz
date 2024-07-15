import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/shared/services/test.service';
import { QuezListType } from 'src/types/quiz-list.type';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {

  quizzes: QuezListType[] = [];

  constructor(private testService: TestService) { }

  ngOnInit(): void {

    this.testService.getTests()
      .subscribe((result: QuezListType[]) => {
        this.quizzes = result;
      });
  }

}
