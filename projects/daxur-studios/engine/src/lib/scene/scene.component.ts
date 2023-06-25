import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Scene } from 'three';

@Component({
  selector: 'daxur-scene',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css'],
  host: {
    class: 'flex-page',
  },
  // changeDetection: ChangeDetectionStrategy.Default,
})
export class SceneComponent implements OnInit, OnDestroy {
  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true })
  gameCanvas?: ElementRef<HTMLCanvasElement>;

  public readonly scene = new Scene();

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;

    this.sizes.width.set(width);
    this.sizes.height.set(height);

    this.onResize();

    this.changeDetectorRef.detectChanges();
  });

  public readonly sizes = {
    width: signal(1),
    height: signal(1),
  };

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.resizeObserver.observe(this.wrapper!.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  onResize(): void {}
}
