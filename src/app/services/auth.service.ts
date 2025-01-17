import {User} from "firebase/auth"; // import User type
import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
// import { isPlatform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  auth = getAuth();
  private userSubject = new BehaviorSubject<User | boolean>(false); // User | false type
  user$ = this.userSubject.asObservable();
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in.
        this.userSubject.next(user);
      } else {
        // User is signed out.
        this.userSubject.next(false);
      }
    });
  }
  // Sign up with email/password
  async signUp(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  onSendPasswordResetEmail(email: string): Promise<void> {
    try {
      const result = sendPasswordResetEmail(this.auth, email);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // async onSignInWithEmailLink(email: string) {
  //   const redirectTo = isPlatform('capacitor') ? 'firebase://login' : `${window.location.origin}/groups`;
  //   console.log('set redirect: ', redirectTo);
  //   try {
  //     const result = await signInWithEmailLink(
  //     this.auth,
  //     email,);
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getCurrentUser(): Observable<User | boolean> {
    return this.user$;
  }
}
