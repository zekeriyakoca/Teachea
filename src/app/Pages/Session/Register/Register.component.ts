import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/Auth.service';

@Component({
  selector: 'teachea-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public authService:AuthService) { }
  
  ngOnInit() {
  }
  
}
