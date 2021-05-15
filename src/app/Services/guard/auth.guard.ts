import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../Auth.service';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/Global/Popups/SnackBar/SnackBar.component';
import { CoreService } from '../core.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router,
    private _snackBar: MatSnackBar,
    public coreService: CoreService,
  ){ }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      console.log("canActivate");
    if (this.authService.user.value == null) {
      console.log("canActivate => auth User");
      let currentUser = await this.authService.getUser();
      if (!currentUser) {
        this.coreService.snackBarMessage = "Önce Kullanıcı Girişi Yapmalısınız";
        this.openSnackBar();
        this.router.navigate(['session/signin'])
      }
    }
    return true;
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 3 * 1000,
      verticalPosition : 'bottom'
    });
  }

}