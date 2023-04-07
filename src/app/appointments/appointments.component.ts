import { Component } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
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

  times = [
    {
      time: '10:00',
      id: 1,
    },
    {
      time: '10:30',
      id: 2,
    },
    {
      time: '11:00',
      id: 3,
    },
  ];

  selectDate(event: any) {
    console.log(event);
  }
}
