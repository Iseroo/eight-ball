import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate() {
    return this.afAuth.authState.pipe(
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        // console.log('loggedIn', loggedIn);

        if (!loggedIn) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
