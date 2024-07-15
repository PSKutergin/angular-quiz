import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { QuezListType } from 'src/types/quiz-list.type';
import { TestResultType } from 'src/types/test-result.type';

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
}
