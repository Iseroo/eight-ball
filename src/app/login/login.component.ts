import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {}

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
  }

  onRegisterSubmit() {
    console.log(this.registerFormRef.value);
    // TODO: Add registration logic here
  }

  checkSamePassword() {
    this.samePassword =
      this.registerFormGroup.value.password ===
      this.registerFormGroup.value.confirmPassword;
    console.log(this.samePassword);
  }
}
