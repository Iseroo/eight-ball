import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Appointment,
  AppointmentFirestore,
  Table,
  User,
} from '../interfaces/interfaces';
import { UserService } from '../services/user.service';
import { AppointmentService } from '../services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  tables = [
    {
      name: 'Table 1',
      id: 1,
    },
    {
      name: 'Table 2',
      id: 2,
    },
    {
      name: 'Table 3',
      id: 3,
    },
  ];

  appointmentForm!: FormGroup;
  userDataForm!: FormGroup;

  selectedBooked: any[] = [];

  selectedTable?: Table;

  selectedDate?: Date;
  startDate?: Date;

  userLoggedIn?: User;

  bookedAppointments?: Appointment;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private _snackBar: MatSnackBar
  ) {
    this.userLoggedIn = this.userService.user;
    this.userService.$user.subscribe((user) => {
      this.userLoggedIn = user;
      if (this.userLoggedIn && this.userDataForm) {
        this.userDataForm
          .get('email')
          ?.setValidators([Validators.email, Validators.required]);
        this.userDataForm.patchValue({
          name: this.userLoggedIn.name ?? this.userLoggedIn.username,
          phoneNumber: this.userLoggedIn.phone,
        });
      }
    });
  }

  ngOnInit(): void {
    this.appointmentForm = new FormGroup({
      table: new FormControl(''),
    });

    this.userDataForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern('[0-9]*'), Validators.required]],
    });
  }

  changeTable(table: any) {
    this.selectedTable = this.tables.find((t) => t.id === table);
    // console.log(this.selectedTable);
    if (this.startDate) {
      this.changeStartDate(this.startDate);
    }
  }

  selectDate(event: any) {
    this.selectedDate = event;
  }

  changeStartDate(date: Date) {
    // console.log(date);
    date.setHours(0, 0, 0, 0);
    this.startDate = date;

    this.appointmentService
      .getAppointmentsForWeek(date, this.selectedTable!.id)
      .subscribe((appointments: any) => {
        let temp: { times: string[]; date: Date }[] = [];
        for (const appointment of appointments) {
          // temp.push()
          const date = new Date(appointment.date.seconds * 1000);
          // date.setHours(0, 0, 0, 0);
          let day = temp.find((t) => t.date === date);
          if (!day) {
            const hour = `${date.getHours()}:${date
              .getMinutes()
              .toString()
              .padStart(2, '0')}`;
            date.setHours(0, 0, 0, 0);
            day = { times: [hour], date: date };
            temp.push(day);
          } else {
            day.times.push(`${date.getHours()}:${date.getMinutes()}`);
          }
          // console.log(temp);
        }
        this.selectedBooked = temp;
      });
  }

  validAppointment() {
    return (
      this.selectedTable &&
      this.selectedDate &&
      this.appointmentForm.valid &&
      this.userDataForm.valid
    );
  }

  submitAppointment() {
    if (
      !this.selectedTable ||
      !this.selectedDate ||
      !this.appointmentForm.valid
    ) {
      return;
    }
    // console.log(this.userDataForm.get('name')?.value);
    let email = '';
    if (this.userLoggedIn) {
      email = this.userLoggedIn.email;
    } else {
      email = this.userDataForm.get('email')?.value;
    }
    let appointment: Appointment = {
      date: this.selectedDate,
      tableId: this.selectedTable.id,
      user_email: email,
      user_name: this.userDataForm.get('name')?.value,
      user_phone: this.userDataForm.get('phoneNumber')?.value,
    };
    // console.log(this.selectedDate);

    this.appointmentService
      .makeAppointment(this.selectedTable.name, appointment)
      .then(() => {
        this.appointmentForm.reset();
        this.userDataForm.reset();
        this.selectedDate = undefined;
        this.selectedTable = undefined;
        this.startDate = undefined;

        this.bookedAppointments = appointment;
        this._snackBar.open('Foglalás létre hozva!', 'Ok');
      });
  }
}
