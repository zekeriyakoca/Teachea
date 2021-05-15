import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AuthService } from 'src/app/Services/Auth.service';

@Component({
  selector: 'teachea-SignIn',
  templateUrl: './CommonSignIn.component.html',
  styleUrls: ['./CommonSignIn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonSignInComponent implements OnInit {

  @Input() returnurl:string = '';
  
  
  constructor(private authService : AuthService) {
    this.email="";
    this.password = "";
    this.rememberMe = true;
   }

  ngOnInit() {
  }
  email:string;
  password:string;
  rememberMe:boolean;

  public signIn(){
    this.authService.login(this.email,this.password,this.returnurl).then(result=>{
    });
  }

}
