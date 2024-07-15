import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QuezListType } from 'src/types/quiz-list.type';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  getTests(): Observable<QuezListType[]> {
    return this.http.get<QuezListType[]>(environment.apiUrl + 'tests');
  }
}
