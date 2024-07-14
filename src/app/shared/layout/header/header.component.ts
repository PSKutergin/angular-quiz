import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogoutResponseType } from 'src/types/logout-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userInfo: UserInfoType | null = null;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    if (this.authService.getLoggedIn()) {
      this.userInfo = this.authService.getUserInfo();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (value: LogoutResponseType) => {
        if (value && !value.error) {
          this.authService.removeTokens();
          this.authService.removeUserInfo();
          this.userInfo = null;
          this._snackBar.open('Вы вышли из системы');
          this.router.navigate(['/']);
        } else {
          this._snackBar.open('Ошибка при выходе из системы');
        }
      },
      error: (error: HttpErrorResponse) => {
        this._snackBar.open('Ошибка при выходе из системы');
      }
    })
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe(isLoggedIn => {
      this.userInfo = isLoggedIn ? this.authService.getUserInfo() : null
    })
  }
}
