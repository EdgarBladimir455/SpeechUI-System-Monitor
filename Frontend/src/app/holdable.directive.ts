import { Directive, HostListener, EventEmitter, Output } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, tap, filter } from 'rxjs/operators';

@Directive({
  selector: '[holdable]'
})
export class HoldableDirective {

  @Output() holdTime: EventEmitter<number> = new EventEmitter();
  @Output() stop = new EventEmitter();
  @Output() start = new EventEmitter();
  stop$ = new Subject<any>();

  constructor() {
    this.stop$.subscribe(() => {
      // this.holdTime.emit(0);
      this.stop.emit();
    });
  }

  @HostListener('mouseup')
  onExit() {
    console.log("mouseup");
    
    this.stop$.next();
  }

  @HostListener('mousedown') 
  onHold() {
    console.log("jooold");

    this.start.emit();
    const ms = 100;

    interval(ms).pipe(
      takeUntil(this.stop$),
      tap(v => {
        this.holdTime.emit(v * ms);
        console.log(v * ms);
        
      }),
    )
    .subscribe();

  }
}