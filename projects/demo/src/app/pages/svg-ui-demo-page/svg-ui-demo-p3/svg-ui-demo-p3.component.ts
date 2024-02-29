import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GeneratedSVG,
  GeneratedSvgComponent,
  GeneratedSvgForm,
} from '@daxur-studios/svg-ui';
import { Subject, takeUntil } from 'rxjs';
import * as data from './data.json';

@Component({
  selector: 'app-svg-ui-demo-p3',
  standalone: true,
  imports: [GeneratedSvgComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './svg-ui-demo-p3.component.html',
  styleUrl: './svg-ui-demo-p3.component.scss',
})
export class SvgUiDemoP3Component implements OnInit, OnDestroy {
  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLDivElement>;

  readonly onDestroy = new Subject<void>();

  readonly gsvg: GeneratedSVG.GSVG<'right' | 'left' | 'centre'> =
    new GeneratedSVG.GSVG({
      onDestroy: this.onDestroy,
      data: GeneratedSvgForm.toGeneratedSvgData(
        GeneratedSvgForm.createGeneratedSvgFormGroup(data as any)
      ),
      controlPointOffsetters: {
        left: (sizes, controlPoint) => {
          // nothing
        },
        right: (sizes, controlPoint) =>
          (controlPoint.offsetX = sizes.width - controlPoint.x),
        centre: (sizes, controlPoint) => {
          const centre = Number(this.centre?.value ?? 0);
          controlPoint.offsetX = controlPoint.x + centre;
          controlPoint.offset_x1 = controlPoint.x + centre;
          controlPoint.offset_x2 = controlPoint.x + centre;
        },
      },
    });

  constructor() {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  ngOnInit(): void {
    this.gsvg.observeWrapperElement(this.wrapper);

    this.centre.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((v) => {
      this.gsvg.recalculate();
    });
  }

  readonly centre = new FormControl(0);
  showDebugPoints = false;
}
