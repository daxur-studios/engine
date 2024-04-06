import { Directive } from '@angular/core';

@Directive({
  selector: '[onPointer]',
})
export class OnPointerDirective {
  constructor() {
    console.log('Hello from OnPointerDirective');
  }
}
