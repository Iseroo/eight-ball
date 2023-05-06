import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DeviceType, DeviceTypeService } from '../services/device-type.service';
import { Weekdays } from '../interfaces/interfaces';

@Component({
  selector: 'app-item-calendar',
  templateUrl: './item-calendar.component.html',
  styleUrls: ['./item-calendar.component.scss'],
})
export class ItemCalendarComponent implements AfterViewInit {
  weekdays: Weekdays[] = [];

  startDate!: Date;
  disableLeft = true;

  @Output()
  startDateEmit = new EventEmitter<Date>();

  @Output()
  selectDate = new EventEmitter<Date>();

  booked: { times: string[]; date: Date }[] = [];

  @Input()
  set bookedDates(bookedDates: { times: string[]; date: Date }[]) {
    // console.log(bookedDates);

    this.booked = bookedDates;
    this.makeWeekdays();
    this.checkNotAvailable();
  }

  deviceType!: DeviceType;

  constructor(private deviceType$: DeviceTypeService) {
    this.deviceType$.subscribe((deviceType) => {
      this.deviceType = deviceType;
    });

    this.searchStartDate();
    this.makeWeekdays();
  }

  searchStartDate() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    this.startDate = new Date(today.setDate(diff));
    this.startDateEmit.emit(this.startDate);
  }

  ngAfterViewInit(): void {
    this.startDateEmit.emit(this.startDate);
  }

  skipRight() {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.startDateEmit.emit(this.startDate);
    this.makeWeekdays();
    this.disableLeft = false;
    this.resetAll();
    this.checkNotAvailable();
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
    this.startDateEmit.emit(this.startDate);
    this.makeWeekdays();
    this.checkNotAvailable();
    this.disableLeft = false;
  }

  makeWeekdays() {
    this.weekdays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.startDate);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + i);
      this.weekdays.push({
        name: date.toLocaleString('default', { weekday: 'long' }),
        id: i + 1,
        date: date,
        appointments: [
          { time: '10:00', selected: false, booked: false },
          { time: '10:30', selected: false, booked: false },
          { time: '11:00', selected: false, booked: false },
          { time: '11:30', selected: false, booked: false },
          { time: '12:00', selected: false, booked: false },
          { time: '12:30', selected: false, booked: false },
          { time: '13:00', selected: false, booked: false },
          { time: '13:30', selected: false, booked: false },
        ],
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
    this.weekdays.forEach((item: any) => {
      item.appointments.forEach((appointment: any) => {
        appointment.selected = false;
      });
    });
  }

  checkNotAvailable() {
    for (let appointment of this.weekdays) {
      for (let book of this.booked) {
        if (appointment.date.getTime() === book.date.getTime()) {
          for (let time of book.times) {
            for (const appointmentTime of appointment.appointments) {
              if (appointmentTime.time === time) {
                appointmentTime.booked = true;
              }
            }
          }
        }
      }
    }
  }

  @HostBinding('class.mb')
  get classMb() {
    return true;
  }
}
