import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, map, take } from 'rxjs';
import { User } from '../interfaces/interfaces';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user?: User;
  $user = new Subject<User | undefined>();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        // console.log('login');
        this.findUser(res.user?.uid as string);
        this.router.navigate(['/user-profile']);
      })
      .catch(() => {
        this._snackBar.open('Nincs ilyen fiók!', 'Ok');
      });
  }

  findUser(UUID: string) {
    this.firestore
      .collection('Users', (ref) => ref.where('UUID', '==', UUID))
      .valueChanges()
      .pipe(
        take(1),
        map((users) => users as User[])
      )
      .subscribe((users) => {
        this.next(users[0] as User);

        // console.log('users', users);
      });
  }

  next(user?: User) {
    this.user = user;
    this.$user.next(this.user);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  createUser(user: User) {
    return this.firestore.collection('Users').add(user);
  }

  editUser(user: User) {
    return this.firestore
      .collection('Users')
      .doc(user.UUID)
      .set(user, { merge: true });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.next(undefined);
      this.router.navigate(['/login']);
    });
  }

  deleteAccount(user: User) {
    this.firestore
      .collection('Users')
      .doc(user.UUID)
      .delete()
      .then(() => {
        this.afAuth.currentUser.then((user) => {
          user
            ?.delete()
            .then(() => {
              this.next(undefined);
              this.router.navigate(['/login']);
            })
            .catch(() => {
              this._snackBar.open(
                'A fiók törléshez friss bejelenetkezés szükséges! Kérlek jelentkezz újra be!',
                'Ok'
              );
            });
        });
      });
  }
}
