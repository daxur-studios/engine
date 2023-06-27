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
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Scene, WebGLRenderer } from 'three';
import { EngineConfig } from '../../models';

@Component({
  selector: 'daxur-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  host: {
    class: 'flex-page',
  },
  // changeDetection: ChangeDetectionStrategy.Default,
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Output() resize = new EventEmitter<{
    width: number;
    height: number;
  }>();

  @Input({ required: true }) config!: EngineConfig;

  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true })
  gameCanvas?: ElementRef<HTMLCanvasElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;

    this.width.set(width);
    this.height.set(height);

    this.onResize();

    this.changeDetectorRef.detectChanges();
  });

  width = signal(1);
  height = signal(1);

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.resizeObserver.observe(this.wrapper!.nativeElement);

    //   this.ready.emit(this);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  onResize(): void {
    this.resize.emit({
      width: this.width(),
      height: this.height(),
    });
  }
}
