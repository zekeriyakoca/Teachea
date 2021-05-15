import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'signIn',
  templateUrl: './SignIn.component.html',
  styleUrls: ['./SignIn.component.scss']
})
export class SignInComponent implements OnInit {
  
 
  constructor(public authService:AuthService) { 
  }

  ngOnInit() {
  }

}
