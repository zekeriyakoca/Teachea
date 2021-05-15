import { Component, OnInit, HostListener, ChangeDetectionStrategy, AfterViewChecked, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { of as observableOf, interval, BehaviorSubject } from 'rxjs';
import { take, finalize, tap } from 'rxjs/operators';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MenuItems } from '../../Core/menu/menu-items/menu-items';
import { Meta, Title } from "@angular/platform-browser";
import { CoreService } from 'src/app/Services/core.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/Services/auth.service';

declare var $: any;


@Component({
   selector: 'app-main',
   templateUrl: './Main.component.html',
   styleUrls: ['./Main.component.scss']
})
export class MainComponent implements OnInit, AfterViewChecked {
   ngAfterViewChecked(): void {
      //console.log("main component afterviewchecked");
   }

   title = 'Teachea';

   mobileQuery: MediaQueryList;

   fillerNav = Array.from({ length: 5 }, (_, i) => `Nav Item ${i + 1}`);

   public headerClass:BehaviorSubject< string> = new BehaviorSubject<string>("");

   private _mobileQueryListener: () => void;
   timer = 0;
   currentUrl: any;

   constructor(private loader: LoadingBarService,
      public coreService: CoreService,
      public menuItems: MenuItems,
      private router: Router,
      meta: Meta,
      title: Title,
      public ngZone: NgZone,
      public authService:AuthService,
      media: MediaMatcher,
      changeDetectorRef: ChangeDetectorRef) {

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
      title.setTitle('Teachea App');

      meta.addTags([
         { name: 'author', content: 'kodilist' },
         { name: 'keywords', content: ' Teachea ' },
         { name: 'description', content: 'Teachea App' }
      ]);

      this.router.events
         .subscribe((event) => {

            if (event instanceof NavigationEnd) {
               this.currentUrl = event.url;
            }
         });
   }

   ngOnInit() {
      this.startTimer();
      this.ngZone.runOutsideAngular(() => {
         window.addEventListener(
            'scroll',
            this.onScrollEvent.bind(this)
         );
      });
   }

   public startTimer() {

      this.timer = 0;
      interval(1000).pipe(
         take(3),
         tap(value => { this.timer = value + 1; }),
         finalize(() => this.loader.complete()),
      ).subscribe();

      // We're sure that subscription has been made, we can start loading bar service
      this.loader.start();
   }

   public hideSideNav() {

      this.coreService.sidenavOpen = false;
   }


   onScrollEvent($event) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollTop >= 200) {
         this.headerClass.next("header-fixed");
      } else {
         this.headerClass.next("");
      }
   }
   signOut(){
      this.authService.logout();
   }
}
