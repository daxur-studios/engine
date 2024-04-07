import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  input,
} from '@angular/core';

import { IEngineOptions } from '../../models';
import { EngineService } from '../engine/engine.service';

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
  readonly options = input.required<IEngineOptions>();
  readonly canvas = input.required<HTMLCanvasElement>();

  @ViewChild('wrapper', { static: true }) wrapper?: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    this.onResize(width, height);
  });

  constructor(
    private renderer: Renderer2,
    readonly engineService: EngineService
  ) {}

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
    this.engineService.width$.next(width);
    this.engineService.height$.next(height);

    this.engineService.resolution$.next({
      width: width,
      height: height,
    });

    this.engineService.resize.emit({
      width: width,
      height: height,
    });
  }

  getShowStatsStyle() {
    const position = this.options().showFPSPosition ?? 'top-left';

    return {
      top: position.includes('top') ? 0 : undefined,
      right: position.includes('right') ? 0 : undefined,
      bottom: position.includes('bottom') ? 0 : undefined,
      left: position.includes('left') ? 0 : undefined,
    };
  }
}
