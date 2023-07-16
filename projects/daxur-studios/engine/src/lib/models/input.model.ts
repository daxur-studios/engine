import { BehaviorSubject } from 'rxjs';

export interface IInputEvents {
  keyup$: BehaviorSubject<KeyboardEvent | null>;
  keydown$: BehaviorSubject<KeyboardEvent | null>;
  mouseup$: BehaviorSubject<MouseEvent | null>;
  mousedown$: BehaviorSubject<MouseEvent | null>;
  mousemove$: BehaviorSubject<MouseEvent | null>;
  mousewheel$: BehaviorSubject<Event | WheelEvent | MouseEvent | null>;
  contextmenu$: BehaviorSubject<MouseEvent | null>;
}
