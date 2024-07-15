import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TestService } from 'src/app/shared/services/test.service';
import { ActionTestType } from 'src/types/action-test.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { QuezType } from 'src/types/quiz.type';
import { userResultType } from 'src/types/user-result.type';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  quiz!: QuezType;
  timerSeconds: number = 59;
  private interval: number = 0;
  currentQuestionIndex: number = 1;
  chosenAnswerId: number | null = null;
  private userResult: userResultType[] = [];
  actionTestType = ActionTestType;

  constructor(private activatedRoute: ActivatedRoute,
    private testService: TestService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.testService.getQuiz(params['id']).subscribe((result) => {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
          } else {
            this.quiz = result as QuezType
            this.startQuiz();
          }
        })
      }
    })
  }

  get activeQuestion() {
    return this.quiz.questions[this.currentQuestionIndex - 1];
  }

  startQuiz(): void {
    this.interval = window.setInterval(() => {
      this.timerSeconds--;
      if (this.timerSeconds === 0) {
        clearInterval(this.interval);
        this.complete();
      }
    }, 1000)
  }

  move(action: ActionTestType): void {

    const existingResult: userResultType | undefined = this.userResult.find(item => item.questionId === this.activeQuestion.id)

    if (this.chosenAnswerId) {
      if (existingResult) {
        existingResult.chosenAnswerId = this.chosenAnswerId
      } else {
        this.userResult.push({
          questionId: this.activeQuestion.id,
          chosenAnswerId: this.chosenAnswerId,
        });
      };
    }

    if (action === ActionTestType.next || action === ActionTestType.pass) {
      if (this.currentQuestionIndex === this.quiz.questions.length) {
        clearInterval(this.interval);
        this.complete();
        return;
      }

      this.currentQuestionIndex++;
    } else {
      this.currentQuestionIndex--;
    };

    const currentResult: userResultType | undefined = this.userResult.find(item => item.questionId === this.activeQuestion.id)
    if (currentResult) {
      this.chosenAnswerId = currentResult.chosenAnswerId
    }
  }

  complete(): void {
    const userInfo = this.authService.getUserInfo();

    if (userInfo) {
      this.testService.passQuiz(this.quiz.id, userInfo.userId, this.userResult)
        .subscribe((result) => {
          if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
          }
          this.router.navigate(['/result'], { queryParams: { id: this.quiz.id } });
        })
    }
  }
}
