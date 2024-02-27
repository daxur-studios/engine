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
    },
    {
      label: 'right',
      x: 708,
      y: 60.99999952316284,
      offsetX: 0,
      offsetY: 0,
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
          position: {
            x: 52,
            y: 93.00000762939453,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          },
        },
        {
          type: 'L',
          tags: ['right'],
          isSelected: false,
          position: {
            x: 707,
            y: 49.00000762939453,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          },
        },
        {
          type: 'L',
          tags: ['bottom', 'right'],
          isSelected: false,
          position: {
            x: 697,
            y: 401.0000047683716,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          },
        },
        {
          type: 'L',
          tags: ['bottom'],
          isSelected: false,
          position: {
            x: 94.00002479553223,
            y: 399.00001335144043,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          },
        },
      ],
      closePath: true,
    },
  ],
};

@Component({
  selector: 'app-svg-ui-demo-p2',
  standalone: true,
  imports: [GeneratedSvgComponent, CommonModule],
  templateUrl: './svg-ui-demo-p2.component.html',
  styleUrl: './svg-ui-demo-p2.component.scss',
})
export class SvgUiDemoP2Component implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  readonly sizes = new BehaviorSubject<GeneratedSVG.Sizes>({
    width: 0,
    height: 0,
  });

  readonly gsvg: BehaviorSubject<GeneratedSVG.GSVG<'right' | 'bottom'>> =
    new BehaviorSubject(
      new GeneratedSVG.GSVG({
        onDestroy: this.onDestroy,
        data: GeneratedSvgForm.toGeneratedSvgData(
          GeneratedSvgForm.createGeneratedSvgFormGroup(TEST)
        ) as GeneratedSVG.GeneratedSvgData<'right' | 'bottom'>,
        controlPointOffsetters: {
          bottom: (sizes, controlPoint) =>
            (controlPoint.offsetY = sizes.height - controlPoint.y),
          right: (sizes, controlPoint) =>
            (controlPoint.offsetX = sizes.width - controlPoint.x),
        },
        sizes: this.sizes,
      })
    );
  readonly fku: BehaviorSubject<GeneratedSVG.GeneratedSvgData> =
    new BehaviorSubject(
      GeneratedSvgForm.toGeneratedSvgData(
        GeneratedSvgForm.createGeneratedSvgFormGroup(TEST)
      )
    );
  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLDivElement>;

  readonly resizeObserver = new ResizeObserver((entries) => {
    this.onResize(entries);
  });

  // readonly controller = new GeneratedSvgController<SimpleTags>({
  //   injector: this.injector,
  //   sizes: this.sizes,
  //   initialData: this.signals.initialData(),
  //   controlPointOffsetters: {
  //     bottom: (sizes, controlPoint) => {
  //       // if (command.type !== 'Z' && initial && initial?.type !== 'Z') {
  //       //   command.offsetY = sizes.height - 200;
  //       // }
  //       // this.controller.gsvg.update((d) => {
  //       //   return { ...d };
  //       // });
  //     },
  //     right: (sizes, initialData) => {
  //       // if (command.type !== 'Z' && initial && initial?.type !== 'Z') {
  //       //   command.x = sizes.width - 200;
  //       // }
  //       // this.controller.gsvg.update((d) => {
  //       //   return { ...d };
  //       // });
  //     },
  //   },
  // });

  constructor(private readonly injector: Injector) {
    // effect(
    //   () => {
    //     const sizes = this.sizes();
    //     this.updateOffsets(sizes);
    //   },
    //   { allowSignalWrites: true }
    // );
    this.gsvg.subscribe((gsvg) => {
      this.fku.next(gsvg);
    });
  }

  private onResize(entries: ResizeObserverEntry[]) {
    this.sizes.next({
      width: entries[0].contentRect.width,
      height: entries[0].contentRect.height,
    });

    this.gsvg.next(this.gsvg.value);
  }

  ngOnInit() {
    this.resizeObserver.observe(this.wrapper.nativeElement);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();

    this.resizeObserver.disconnect();
  }

  // private updateOffsets(sizes: GeneratedSVG.Sizes) {
  //   const data = this.signals.initialData();
  //   data.elements.forEach((element) => {
  //     if (element.type === 'path') {
  //       element.commands.forEach((command) => {
  //         if (command.type !== 'Z') {
  //           if (command.tags.includes('bottom')) {
  //             //command.y = window.innerHeight - 200; // command.y + 1; // command.offsetY;
  //           }

  //           if (command.tags.includes('right')) {
  //             //   command.x = window.innerWidth - 200; // command.x + 1; //  command.offsetX;
  //           }
  //         }
  //       });
  //     }
  //   });

  //   this.signals.initialData.set(data);
  //   console.log('data', data);
  // }
}

// class GeneratedSvgController<TAGS extends string> {

//   constructor(
//     readonly options: {
//       injector: Injector;
//       sizes: WritableSignal<GeneratedSVG.Sizes>;
//       controlPointOffsetters: GeneratedSVG.OffsetFn<TAGS>;
//       initialData: GeneratedSVG.GeneratedSvgData;
//     }
//   ) {
//     this.gsvg.set(JSON.parse(JSON.stringify(this.options.initialData)));

//     const gsvg = this.gsvg();

//     effect(
//       () => {
//         const sizes = this.options.sizes();

//         this.updateOffsets(sizes, gsvg);
//       },
//       { allowSignalWrites: true, injector: this.options.injector }
//     );
//   }

// private updateOffsets(
//   sizes: GeneratedSVG.Sizes,
//   gsvg: GeneratedSVG.GSVG<TAGS>
// ) {
//   const methods = this.options.controlPointOffsetters;

//   for (const key in methods) {
//     if (methods.hasOwnProperty(key)) {
//       methods[key](sizes, gsvg);
//     }
//   }
// }

//   public getItemsByTag(tag: TAGS, initialData: GeneratedSVG.GeneratedSvgData) {
//     const results: {
//       circles: (GeneratedSVG.SVGElement & { type: 'circle' })[];
//       commands: GeneratedSVG.Command[];
//     } = {
//       circles: [],
//       commands: [],
//     };

//     //const generatedSvg = this.data();
//     const x = initialData;

//     for (const element of x.elements) {
//       if (element.type === 'path') {
//         for (const command of element.commands) {
//           if (command.tags.includes(tag)) {
//             results.commands.push(command);
//           }
//         }
//       } else if (element.type === 'circle') {
//         if (element.tags.includes(tag)) {
//           results.circles.push(element);
//         }
//       }
//     }

//     return results;
//   }
// }

type SimpleTags = 'bottom' | 'right';

const test = <GeneratedSVG.OffsetFn<SimpleTags>>{
  bottom: () => 0,
  right: () => 1,
};
