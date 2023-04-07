import { Component, HostBinding } from '@angular/core';
import { DeviceType, DeviceTypeService } from '../services/device-type.service';

@Component({
  selector: 'app-item-calendar',
  templateUrl: './item-calendar.component.html',
  styleUrls: ['./item-calendar.component.scss'],
})
export class ItemCalendarComponent {
  items: any = [];

  weekdays: any = [];

  startDate!: Date;

  deviceType!: DeviceType;

  constructor(private deviceType$: DeviceTypeService) {
    this.deviceType$.subscribe((deviceType) => {
      this.deviceType = deviceType;
    });
    for (let i = 1; i <= 7; i++) {
      this.items.push({
        name: `Table ${i}`,
        id: i,
        appointments: [
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '12:00',
          '12:30',
          '13:00',
          '13:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
          '21:00',
          '21:30',
          '22:00',
          '22:30',
        ],
      });
    }
    this.searchStartDate();
    this.makeWeekdays();
  }

  searchStartDate() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    this.startDate = new Date(today.setDate(diff));
  }

  skipRight() {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.makeWeekdays();
  }

  skipLeft() {
    if (this.startDate.getDate() < 7) {
      return;
    }
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.makeWeekdays();
  }

  makeWeekdays() {
    this.weekdays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.startDate);
      date.setDate(date.getDate() + i);
      this.weekdays.push({
        name: date.toLocaleString('default', { weekday: 'long' }),
        id: i + 1,
        date: date.toLocaleDateString(),
      });
    }
  }

  @HostBinding('class.mb')
  get classMb() {
    return true;
  }
}
