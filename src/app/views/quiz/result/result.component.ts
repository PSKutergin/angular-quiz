import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TestService } from 'src/app/shared/services/test.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { PassTestResponseType } from 'src/types/pass-test-response.type';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  userResult: string = '';

  constructor(private testService: TestService, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();

    if (userInfo) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['id']) {
          this.testService.getResult(params['id'], userInfo.userId).subscribe((result) => {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
            } else {
              this.userResult = (result as PassTestResponseType).score + '/' + (result as PassTestResponseType).total;
            }
          })
        }
      })
    }

  }

}
