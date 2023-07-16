import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable()
/** New Instance Per EngineComponent */
export class InputService {
  keyup$ = new BehaviorSubject<KeyboardEvent | null>(null);
  keydown$ = new BehaviorSubject<KeyboardEvent | null>(null);
  mouseup$ = new BehaviorSubject<MouseEvent | null>(null);
  mousedown$ = new BehaviorSubject<MouseEvent | null>(null);
  mousemove$ = new BehaviorSubject<MouseEvent | null>(null);

  mousewheel$ = new BehaviorSubject<Event | WheelEvent | MouseEvent | null>(
    null
  );
  contextmenu$ = new BehaviorSubject<MouseEvent | null>(null);

  constructor() {}
}
