import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import {
  GeneratedSVG,
  GeneratedSvgComponent,
  GeneratedSvgForm,
  ResizeDirective,
} from '@daxur-studios/svg-ui';
import { BehaviorSubject, Subject } from 'rxjs';

const TEST: GeneratedSvgForm.GeneratedSvgFormGroup['value'] = {
  uniqueTags: [
    {
      label: 'bottom',
      x: 683,
      y: 401.9999918937683,
      offsetX: 0,
      offsetY: 0,
      offset_x1: 0,
      offset_y1: 0,
      offset_x2: 0,
      offset_y2: 0,
    },
    {
      label: 'right',
      x: 708,
      y: 60.99999952316284,
      offsetX: 0,
      offsetY: 0,
      offset_x1: 0,
      offset_y1: 0,
      offset_x2: 0,
      offset_y2: 0,
    },
  ],
  elements: [
    {
      type: 'path',
      tags: [],
      fill: '#212121',
      stroke: '#2bff00',
      strokeWidth: '1',
      commands: [
        {
          type: 'M',
          tags: [],
          isSelected: false,
          x: 52,
          y: 93.00000762939453,
        },
        {
          type: 'L',
          tags: ['right'],
          isSelected: false,
          x: 707,
          y: 49.00000762939453,
        },
        {
          type: 'L',
          tags: ['bottom', 'right'],
          isSelected: false,
          x: 697,
          y: 401.0000047683716,
        },
        {
          type: 'L',
          tags: ['bottom'],
          isSelected: false,
          x: 94.00002479553223,
          y: 399.00001335144043,
        },
      ],
      closePath: true,
    },
  ],
};

@Component({
  selector: 'app-svg-ui-demo-p2',
  standalone: true,
  imports: [GeneratedSvgComponent, CommonModule, ResizeDirective],
  templateUrl: './svg-ui-demo-p2.component.html',
  styleUrl: './svg-ui-demo-p2.component.scss',
})
export class SvgUiDemoP2Component implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  readonly gsvg: GeneratedSVG.GSVG<'right' | 'bottom'> = new GeneratedSVG.GSVG({
    onDestroy: this.onDestroy,
    data: GeneratedSvgForm.toGeneratedSvgData(
      GeneratedSvgForm.createGeneratedSvgFormGroup(TEST)
    ),
    controlPointOffsetters: {
      bottom: (sizes, controlPoint) =>
        (controlPoint.offsetY = sizes.height - controlPoint.y),
      right: (sizes, controlPoint) =>
        (controlPoint.offsetX = sizes.width - controlPoint.x),
    },
  });

  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLDivElement>;

  constructor(private readonly injector: Injector) {}

  ngOnInit() {
    //  this.gsvg.observeWrapperElement(this.wrapper);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();

    this.gsvg.dispose();
  }
}

type SimpleTags = 'bottom' | 'right';

const test = <GeneratedSVG.OffsetFn<SimpleTags>>{
  bottom: () => 0,
  right: () => 1,
};
