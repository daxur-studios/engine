import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { GeneratedSVG } from '../../models';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-generated-svg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generated-svg.component.html',
  styleUrl: './generated-svg.component.scss',
})
export class GeneratedSvgComponent implements OnInit, OnDestroy {
  @Input({ required: true })
  data!: BehaviorSubject<GeneratedSVG.GeneratedSvgData>;

  @ViewChild('svgElement', { static: true })
  svgElement?: ElementRef<SVGGraphicsElement>;

  readonly width = new BehaviorSubject<number>(0);
  readonly height = new BehaviorSubject<number>(0);

  private readonly onDestroy = new Subject<void>();

  constructor(
    readonly injector: Injector,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnInit(): void {
    this.data.pipe(takeUntil(this.onDestroy)).subscribe((data) => {
      this.width.next(this.getMaxWidth(data));
      this.height.next(this.getMaxHeight(data));

      this.changeDetectorRef.detectChanges();
    });
  }

  getMaxWidth(data: GeneratedSVG.GeneratedSvgData) {
    const inputs = data?.elements;

    let maxX = 0;

    inputs.forEach((input) => {
      if (input.type === 'circle') {
        maxX = Math.max(maxX, input.cx + input.offsetCx + input.r);
      } else {
        input.commands.forEach((command) => {
          if (command.type === 'Z') return;
          maxX = Math.max(maxX, command.x + command.offsetX);
        });
      }
    });

    return maxX;
  }

  getMaxHeight(data: GeneratedSVG.GeneratedSvgData) {
    const inputs = data?.elements;

    let maxY = 0;

    inputs.forEach((input) => {
      if (input.type === 'circle') {
        maxY = Math.max(maxY, input.cy + input.offsetCy + input.r);
      } else {
        input.commands.forEach((command) => {
          if (command.type === 'Z') return;
          maxY = Math.max(maxY, command.y + command.offsetY);
        });
      }
    });

    return maxY;
  }

  public calculateData(element: GeneratedSVG.SVGElement): string {
    let d = '';
    if (element.type === 'path') {
      d =
        element.commands.map(GeneratedSVG.commandToString).join('') +
        (element.closePath ? 'Z' : '');
    }

    return d;
  }
}
