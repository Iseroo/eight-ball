import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

// custom because not material defined ones
const CustomBreakpoints = {
  mobile: '(max-width: 800px)',

  desktop: '(min-width: 801px)',
} as const;

type BreakpointName = keyof typeof CustomBreakpoints;
export type DeviceType = BreakpointName;

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService extends BehaviorSubject<BreakpointName> {
  constructor(private breakpointObserver: BreakpointObserver) {
    super('mobile');
    this.breakpointObserver
      .observe([CustomBreakpoints.mobile, CustomBreakpoints.desktop])
      .pipe(
        map((state: BreakpointState): BreakpointName => {
          if (state.breakpoints[CustomBreakpoints.mobile]) {
            return 'mobile';
          } else if (state.breakpoints[CustomBreakpoints.desktop]) {
            return 'desktop';
          }
          return 'mobile'; // default
        })
      )
      .subscribe(this);
  }
}
