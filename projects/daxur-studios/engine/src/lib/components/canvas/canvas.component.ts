import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  input,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Scene, WebGLRenderer } from 'three';

import { BehaviorSubject } from 'rxjs';

import { EngineController } from '../../services';
import { IEngineOptions } from '../../models';

@Component({
  selector: 'daxur-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  host: {
    class: 'flex-page',
  },
})
export class CanvasComponent implements OnInit, OnDestroy {
  readonly controller = input.required<EngineController>();
  readonly canvas = input.required<HTMLCanvasElement>();

  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.onResize(width, height);
  });

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const canvas = this.canvas();
    // append canvas to the wrapper
    this.renderer.appendChild(this.wrapper!.nativeElement, canvas);
  }

  ngOnInit(): void {
    this.resizeObserver.observe(this.wrapper!.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  onResize(width: number, height: number): void {
    if (!this.controller) return;
    const controller = this.controller()!;

    controller.width$.next(width);
    controller.height$.next(height);

    controller.resolution$.next({
      width: width,
      height: height,
    });

    controller.resize.emit({
      width: width,
      height: height,
    });
  }
}
