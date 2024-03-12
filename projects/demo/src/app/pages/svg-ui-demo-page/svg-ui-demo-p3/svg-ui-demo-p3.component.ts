import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GeneratedSVG,
  GeneratedSvgComponent,
  GeneratedSvgForm,
  ResizeDirective,
} from '@daxur-studios/svg-ui';
import { Subject, takeUntil } from 'rxjs';
import * as data from './data.json';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-svg-ui-demo-p3',
  standalone: true,
  imports: [
    GeneratedSvgComponent,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ResizeDirective,
  ],
  templateUrl: './svg-ui-demo-p3.component.html',
  styleUrl: './svg-ui-demo-p3.component.scss',
})
export class SvgUiDemoP3Component implements OnInit, OnDestroy {
  private _wrapper = signal<ElementRef<HTMLDivElement> | undefined>(undefined);
  @ViewChild('wrapper', { static: true }) set wrapper(
    wrapper: ElementRef<HTMLDivElement> | undefined
  ) {
    this._wrapper.set(wrapper);
  }
  get wrapper() {
    return this._wrapper();
  }

  private _buttons = signal<ElementRef<MatIconButton>[]>([]);
  @ViewChildren('button') set buttons(buttons: ElementRef<MatIconButton>[]) {
    this._buttons.set(buttons);
  }
  get buttons() {
    return this._buttons();
  }

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

  public readonly toolbarItems = [
    {
      icon: 'home',
      label: 'Home',
    },
    {
      icon: 'delete',
      label: 'Delete',
    },
    {
      icon: 'edit',
      label: 'Edit',
    },
    {
      icon: 'save',
      label: 'Save',
    },
    {
      icon: 'settings',
      label: 'Settings',
    },
  ];

  constructor() {}

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  ngOnInit(): void {
    // this.gsvg.observeWrapperElement(this.wrapper);

    this.centre.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((v) => {
      this.gsvg.recalculate();
    });
  }

  readonly centre = new FormControl(0);
  showDebugPoints = false;

  setCenter(itemButton: MatIconButton, itemsWrapper: HTMLDivElement) {
    console.debug('button', itemButton);

    const wrapperWidth = itemsWrapper.clientWidth;
    const buttonOffset = itemButton._elementRef.nativeElement.offsetLeft;

    this.centre.setValue(buttonOffset - 75);
  }
}
