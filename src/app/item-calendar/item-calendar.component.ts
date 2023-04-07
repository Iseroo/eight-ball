import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
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
  disableLeft = true;

  @Output()
  selectDate = new EventEmitter<Date>();

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
          { time: '10:00', selected: false },
          { time: '10:30', selected: false },
          { time: '11:00', selected: false },
          { time: '11:30', selected: false },
          { time: '12:00', selected: false },
          { time: '12:30', selected: false },
          { time: '13:00', selected: false },
          { time: '13:30', selected: false },
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
    this.disableLeft = false;
    this.resetAll();
  }

  skipLeft() {
    const prevWeek = new Date(this.startDate);
    prevWeek.setHours(0, 0, 0, 0);
    prevWeek.setDate(prevWeek.getDate() - 7);

    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const thisMonday = new Date(today.setDate(diff));
    thisMonday.setHours(0, 0, 0, 0);

    if (prevWeek.getTime() < thisMonday.getTime()) {
      this.disableLeft = true;
      return;
    }
    this.resetAll();
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.makeWeekdays();
    this.disableLeft = false;
  }

  makeWeekdays() {
    this.weekdays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.startDate);
      date.setDate(date.getDate() + i);
      this.weekdays.push({
        name: date.toLocaleString('default', { weekday: 'long' }),
        id: i + 1,
        date: date,
      });
    }
  }

  selectTime(
    appointment: { time: string; selected: boolean },
    dayIndex: number
  ) {
    this.resetAll();
    appointment.selected = !appointment.selected;
    const date = new Date(this.weekdays[dayIndex].date);
    const time = appointment.time.split(':');
    date.setHours(+time[0], +time[1], 0, 0);

    this.selectDate.emit(date);
  }

  resetAll() {
    this.items.forEach((item: any) => {
      item.appointments.forEach((appointment: any) => {
        appointment.selected = false;
      });
    });
  }

  @HostBinding('class.mb')
  get classMb() {
    return true;
  }
}
