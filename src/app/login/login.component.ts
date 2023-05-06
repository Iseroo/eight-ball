import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/interfaces';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('registerFormRef') registerFormRef!: NgForm;

  showLogin = true;

  loginForm!: FormGroup;
  registerFormGroup!: FormGroup;

  hide = true;

  samePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    // TODO: Add authentication logic here
    // this.userService.next(true);
    this.userService.login(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    );
  }

  onRegisterSubmit() {
    // console.log(this.registerFormRef.value);
    this.userService
      .register(
        this.registerFormGroup.get('email')?.value,
        this.registerFormGroup.get('password')?.value
      )
      .then((res) => {
        console.log(res);
        let user: User = {
          UUID: res.user!.uid,
          email: this.registerFormGroup.get('email')?.value,
          username: this.registerFormGroup.get('username')?.value,
        };
        this.userService.createUser(user).then(() => {
          this.userService.login(
            this.registerFormGroup.get('email')?.value,
            this.registerFormGroup.get('password')?.value
          );
          this.router.navigate(['/user-profile']);
        });
      })
      .catch(() => {
        this._snackBar.open('Már van fiók ilyen email címmel!', 'Ok');
      });
  }

  checkSamePassword() {
    this.samePassword =
      this.registerFormGroup.value.password ===
      this.registerFormGroup.value.confirmPassword;
    console.log(this.samePassword);
  }
}
