import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";
import { AngularFireDatabase } from "@angular/fire/database";
import { fbUser } from "../Models/modelStack";
import { Observable, BehaviorSubject, Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../Global/Popups/SnackBar/SnackBar.component';
import { CoreService } from './core.service';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  returnUrl: string = "";
  USERKEY: string = "user";
  authSubscription: Subscription;

  constructor(
    public afAuth: AngularFireAuth,
    private coreService:CoreService,
    public router: Router,
    public ngZone: NgZone,
    public db: AngularFireDatabase,
    public _snackBar:MatSnackBar
  ) {
    this.intitializeAuth();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  intitializeAuth() {
    if (!this.authSubscription) {
      this.authSubscription = this.afAuth.authState.subscribe(user => {
        if (user) {
          this.user.next(user);

        } else {
          this.user.next(null);
        }
      });
    }
  }

  testLogin(){
    this.login("zekeriyakocairi1@gmail.com","Test123.","records");
    this.coreService.snackBarMessage = "Test kullanıcısı olarak giriş yaptınız."
    this.openSnackBar();
  }
  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 5 * 1000,
      verticalPosition : 'bottom'
    });
  }
  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async login(email: string, password: string, returnUrl = "") {
    try {
      await this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(result => {
          this.intitializeAuth();
        });
      if (returnUrl !== "")
        this.router.navigate([returnUrl]);
      else
        this.router.navigate([""]);
    } catch (e) {
      alert("Error!" + e.message);
    }
  }

  SignUp(firstname, lastname, email, password) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign 
            up and returns promise */
        this.SendVerificationMail();
        this.CreateUserObjectOnDB(firstname, lastname, result.user);
      })
      .catch(error => {
        alert(error.message);
      });
  }

  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        alert("Password reset email sent, check your inbox.");
      })
      .catch(error => {
        alert(error);
      });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.ngZone.run(async () => {
          this.user.next(result.user);
          if (!await this.CheckIfUserExistInFB(result.user.uid))
            this.CreateUserObjectOnDB(result.user.displayName, "", result.user);
          this.router.navigate([""]);
        });
      })
      .catch(error => {
        window.alert(error);
      });
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.user.next(null);
    this.router.navigate(["session/signin"]);
  }

  get isLoggedIn(): boolean {
    return this.user.value !== null;
  }

  CreateUserObjectOnDB(firstname: string, lastname: string, currentUser: User) {
    this.db
      .object("/users/" + currentUser.uid)
      .remove()
      .catch();

    let tempUser: fbUser = new fbUser(currentUser, firstname, lastname);
    this.db
      .list("/users")
      .push(tempUser)
      .then();
  }

  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(["createRecord"]);
    });
  }

  async CheckIfUserExistInFB(uid: string) {
    return await this.db.object("/users/" + uid).valueChanges().pipe(first()).toPromise();
  }
  GetUserInFB(uid: string): Observable<any> {
    return this.db.object("/users/" + uid).valueChanges();
  }

  GetCurrentUserIdToken(): Promise<string> {
    return this.afAuth.auth.currentUser.getIdToken(true);
  }

}
