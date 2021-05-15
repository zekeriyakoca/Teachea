import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/Auth.service';

@Component({
  selector: 'teachea-ForgotPassword',
  templateUrl: './ForgotPassword.component.html',
  styleUrls: ['./ForgotPassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public authService :AuthService) { }

  ngOnInit() {
  }

}
