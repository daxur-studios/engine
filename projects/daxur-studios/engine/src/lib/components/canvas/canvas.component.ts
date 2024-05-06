import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  input,
  output,
  viewChild,
} from '@angular/core';

import { IEngineOptions } from '../../models';
import { EngineService } from '../../services/engine.service';

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

  readonly css2dRenderer =
    viewChild.required<ElementRef<HTMLElement>>('css2dRenderer');

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

    this.engineService.initCss2dRenderer(this.css2dRenderer()!.nativeElement!);
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
}
