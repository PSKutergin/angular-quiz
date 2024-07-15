import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TestService } from 'src/app/shared/services/test.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { QuezListType } from 'src/types/quiz-list.type';
import { TestResultType } from 'src/types/test-result.type';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {

  quizzes: QuezListType[] = [];
  restResult: TestResultType[] | null = null;

  constructor(private testService: TestService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.testService.getTests()
      .subscribe((result: QuezListType[]) => {
        this.quizzes = result;

        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          this.testService.getUserResults(userInfo.userId)
            .subscribe((result: TestResultType[] | DefaultResponseType) => {
              if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                  throw new Error((result as DefaultResponseType).message);
                }

                const restResult = result as TestResultType[];
                if (restResult) {
                  this.quizzes = this.quizzes.map((quiz) => {
                    const foundItem: TestResultType | undefined = restResult.find((item) => item.testId === quiz.id);
                    if (foundItem) {
                      return { ...quiz, result: foundItem.score + '/' + foundItem.total };
                    }
                    return quiz;
                  })
                }
              }
            })
        }
      });
  }

  chooseQuiz(id: number): void {
    this.router.navigate(['/test', id]);
  }
}
