import { Component, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeviceType, DeviceTypeService } from '../services/device-type.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  deviceType!: DeviceType;

  isSidenavOpened = false;
  constructor(private deviceType$: DeviceTypeService) {
    this.deviceType$.subscribe((deviceType) => {
      this.deviceType = deviceType;
    });
  }

  @HostBinding('class.mb')
  get classMb() {
    return true;
  }
}
