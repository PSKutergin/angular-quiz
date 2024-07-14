import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponseType } from 'src/types/login-response.type';
import { LogoutResponseType } from 'src/types/logout-response.type';
import { SignupResponseType } from 'src/types/signup-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  private refreshTokenKey: string = 'refreshToken';
  private userInfoKey: string = 'userInfo';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(email: string, password: string): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.apiUrl + 'login', { email, password })
      .pipe(
        tap((data: LoginResponseType) => {
          if (data.userId && data.accessToken && data.refreshToken && data.fullName) {
            this.setUserInfo({
              userId: data.userId,
              fullName: data.fullName
            })
            this.setTokens(data.accessToken, data.refreshToken);
          }
        })
      )
  }

  signup(name: string, lastName: string, email: string, password: string): Observable<SignupResponseType> {
    return this.http.post<SignupResponseType>(environment.apiUrl + 'signup', { name, lastName, email, password });
  }

  logout(): Observable<LogoutResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<LogoutResponseType>(environment.apiUrl + 'logout', { refreshToken });
  }

  public getLoggedIn(): boolean {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }

  public setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info));
  }

  public getUserInfo(): UserInfoType | null {
    const userInfo: string | null = localStorage.getItem(this.userInfoKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
}
