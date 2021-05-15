import { Component, OnDestroy, ChangeDetectorRef, OnInit, AfterViewChecked } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {


  constructor( private router: Router, private cdRef:ChangeDetectorRef ) {
      
 }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  
   ngOnInit() {
      this.router.events.subscribe((evt) => {
          if (!(evt instanceof NavigationEnd)) {
              return;
          }
          window.scrollTo(0, 0)
      });
  }
}
