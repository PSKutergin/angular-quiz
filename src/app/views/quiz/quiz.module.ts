import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { ChoiceComponent } from './choice/choice.component';
import { TestComponent } from './test/test.component';
import { ResultComponent } from './result/result.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChoiceComponent,
    TestComponent,
    ResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QuizRoutingModule
  ]
})
export class QuizModule { }
