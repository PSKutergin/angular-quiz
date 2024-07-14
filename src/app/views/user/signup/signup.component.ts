import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LoginResponseType } from 'src/types/login-response.type';
import { SignupResponseType } from 'src/types/signup-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[А-Я][а-я]+\s*$/)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(/^[А-Я][а-я]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]),
    agree: new FormControl(false, [Validators.required])
  })

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  get name() {
    return this.signupForm.get('name');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  ngOnInit(): void {
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.name && this.signupForm.value.lastName) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.lastName, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: SignupResponseType) => {
            if (data.error || !data.user) {
              this._snackBar.open('Ошибка при регистрации');
              throw new Error(data.message || 'Error with data on signup');
            }

            if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password) {
              this.authService.login(this.signupForm.value.email, this.signupForm.value.password)
                .subscribe({
                  next: (data: LoginResponseType) => {
                    if (data.error || !data.userId || !data.accessToken || !data.refreshToken || !data.fullName) {
                      this._snackBar.open('Пользователь зарегистрирован, но не авторизован');
                      throw new Error(data.message || 'Error with data on login');
                    }

                    this.router.navigate(['/choice']);
                  },
                  error: (error: HttpErrorResponse) => {
                    this._snackBar.open(error.error.message || 'Error with data on login');
                    throw new Error(error.error.message);
                  }
                })
            }
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open(error.error.message || 'Error with data on signup');
            throw new Error(error.error.message);
          }
        })
    }
  }

}
