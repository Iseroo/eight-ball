import { Component, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeviceType, DeviceTypeService } from '../services/device-type.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  deviceType!: DeviceType;

  loggedIn?: User;

  isSidenavOpened = false;
  constructor(
    private deviceType$: DeviceTypeService,
    private userService: UserService
  ) {
    this.deviceType$.subscribe((deviceType) => {
      this.deviceType = deviceType;
    });
    this.loggedIn = this.userService.user;
    this.userService.$user.subscribe((user) => {
      this.loggedIn = user;
      console.log(this.loggedIn);
    });
  }

  logout() {
    this.userService.logout();
  }

  @HostBinding('class.mb')
  get classMb() {
    return true;
  }
}
