import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { PassTestResponseType } from 'src/types/pass-test-response.type';
import { QuezListType } from 'src/types/quiz-list.type';
import { QuezType } from 'src/types/quiz.type';
import { TestResultType } from 'src/types/test-result.type';
import { userResultType } from 'src/types/user-result.type';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  getTests(): Observable<QuezListType[]> {
    return this.http.get<QuezListType[]>(environment.apiUrl + 'tests');
  }

  getUserResults(userId: number): Observable<TestResultType[] | DefaultResponseType> {
    return this.http.get<TestResultType[] | DefaultResponseType>(environment.apiUrl + 'tests/results?userId=' + userId);
  }

  getQuiz(id: number | string): Observable<QuezType | DefaultResponseType> {
    return this.http.get<QuezType | DefaultResponseType>(environment.apiUrl + 'tests/' + id);
  }

  passQuiz(id: number | string, userId: number | string, userResult: userResultType[]): Observable<PassTestResponseType | DefaultResponseType> {
    return this.http.post<PassTestResponseType | DefaultResponseType>(environment.apiUrl + 'tests/' + id + '/pass',
      {
        userId: userId,
        results: userResult
      }
    );
  }

  getResult(id: number | string, userId: number | string): Observable<PassTestResponseType | DefaultResponseType> {
    return this.http.get<PassTestResponseType | DefaultResponseType>(environment.apiUrl + 'tests/' + id + '/result?userId=' + userId);
  }
}
