import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private subject: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }

  routeListener() {
    return this.subject.asObservable();
  }

  notInHome() {
    this.subject.next(false);
  }

  inHome() {
    this.subject.next(true);
  }

}
