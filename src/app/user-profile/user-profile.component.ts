import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Appointment,
  AppointmentFirestore,
  User,
} from '../interfaces/interfaces';
import { UserService } from '../services/user.service';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  appointments: AppointmentFirestore[] = [];

  user?: User;

  editProfile!: FormGroup;

  success?: boolean;

  warningVisible = false;

  visibleList = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.editProfile = this.formBuilder.group({
      name: [this.user ? this.user.name : ''],
      phone: [this.user ? this.user.phone : ''],
    });
    this.user = this.userService.user;
    this.userService.$user.subscribe((user) => {
      this.user = user;
      if (!user) return;
      this.updateValues();
    });

    if (this.user) {
      this.updateValues();
    }
  }

  updateValues() {
    this.editProfile.patchValue({
      name: this.user!.name,
      phone: this.user!.phone,
    });
    this.findAppointments();
  }

  onSubmit() {
    // save changes to the server
    let user = this.userService.user;
    if (!user) return;
    user.name = this.editProfile.get('name')?.value;
    user.phone = this.editProfile.get('phone')?.value;
    this.userService
      .editUser(user)
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.success = false;
      });
  }

  deleteUser() {
    if (!this.user) return;
    this.userService.deleteAccount(this.user);
  }

  findAppointments() {
    if (!this.user) return;
    console.log(this.user.email);

    this.appointmentService
      .getAppointmentsByUserEmail(this.user.email)
      .subscribe((appointments) => {
        console.log(appointments);

        this.appointments = appointments as AppointmentFirestore[];
        if (this.appointments.length > 0) {
          this.visibleList = true;
        }
      });
  }
}
