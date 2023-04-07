import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

  selectedBooked: any = [];

  ngOnInit(): void {
    this.appointmentForm = new FormGroup({
      table: new FormControl(''),
    });
  }

  changeTable(table: any) {
    console.log(table);
  }

  selectDate(event: any) {
    console.log(event);
  }
}
