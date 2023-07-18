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
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Scene, WebGLRenderer } from 'three';

import { BehaviorSubject } from 'rxjs';

import { EngineService, InputService } from '../../services';

@Component({
  selector: 'daxur-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  host: {
    class: 'flex-page',
  },
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Output() resize = this.engineService.resize;

  @Input({ required: true }) canvas?: HTMLCanvasElement;

  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.onResize(width, height);
  });

  constructor(
    private renderer: Renderer2,
    public input: InputService,
    public readonly engineService: EngineService
  ) {}

  ngAfterViewInit() {
    const canvas = this.canvas;
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
    this.engineService.width$.next(width);
    this.engineService.height$.next(height);

    this.engineService.resolution$.next({
      width: width,
      height: height,
    });

    this.resize.emit({
      width: width,
      height: height,
    });
  }
}
