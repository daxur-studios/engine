import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[libResize]',
  standalone: true,
})
export class ResizeDirective implements OnInit, OnDestroy {
  @Output() onResize = new EventEmitter<ResizeObserverEntry[]>();

  readonly resizeObserver = new ResizeObserver((entries) => {
    this.onResize.emit(entries);
  });

  constructor(private readonly element: ElementRef<HTMLElement>) {
    this.resizeObserver.observe(element.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  ngOnInit(): void {}
}
