import { Injector, Signal, effect } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

export module GeneratedSVG {
  export type CommandType = 'M' | 'L' | 'C' | 'Z';

  const _TYPE_OPTIONS: {
    [key in CommandType]: {
      label: string;
      value: key;
    };
  } = {
    M: {
      label: 'Move To',
      value: 'M',
    },
    L: {
      label: 'Line To',
      value: 'L',
    },
    C: {
      label: 'Curve To',
      value: 'C',
    },
    Z: {
      label: 'Close Path',
      value: 'Z',
    },
  };
  export const TYPE_OPTIONS: {
    label: string;
    value: CommandType;
  }[] = Object.values(_TYPE_OPTIONS);

  export type Command = {
    type: CommandType;
    tags: string[];
  } & (MoveToCommand | LineToCommand | ClosePathCommand | CurveToCommand);

  export interface MoveToCommand {
    type: 'M';
    x: number;
    y: number;

    offsetX: number;
    offsetY: number;
  }
  export interface LineToCommand {
    type: 'L';
    x: number;
    y: number;

    offsetX: number;
    offsetY: number;
  }

  export interface CurveToCommand {
    type: 'C';

    x1: number;
    y1: number;

    x2: number;
    y2: number;

    x: number;
    y: number;

    offsetX: number;
    offsetY: number;

    offset_x1: number;
    offset_y1: number;

    offset_x2: number;
    offset_y2: number;

    tagsXY1: string[];
    tagsXY2: string[];
  }

  export interface ClosePathCommand {
    type: 'Z';
  }

  export function commandToString(command: Command): string {
    const formatters: {
      [TYPE in CommandType]: (c: Command & { type: TYPE }) => string;
    } = {
      M: (c) => `M ${c.x + c.offsetX} ${c.y + c.offsetY}`,
      L: (c) => `L ${c.x + c.offsetX} ${c.y + c.offsetY}`,
      C: (c) =>
        `C ${c.x1 + c.offset_x1} ${c.y1 + c.offset_y1} ${c.x2 + c.offset_x2} ${
          c.y2 + c.offset_y2
        } ${c.x + c.offsetX} ${c.y + c.offsetY}`,
      Z: (c) => 'Z',
    };

    return formatters[command.type](command as any);
  }

  /** The types of  */
  export type SvgInputType = 'circle' | 'path';

  export interface Path {
    type: 'path';
    commands: Command[];
    fill: string;
    stroke: string;
    strokeWidth: string;
    closePath: boolean;
  }

  export interface Circle {
    type: 'circle';
    tags: string[];
    cx: number;
    cy: number;

    offsetCx: number;
    offsetCy: number;

    r: number;
    fill: string;
    stroke: string;
    strokeWidth: string;
  }

  export type SVGElement = {
    type: SvgInputType;
  } & (Path | Circle);

  export interface ITag {
    label: string;
    x: number;
    y: number;

    offsetX: number;
    offsetY: number;

    offset_x1: number;
    offset_y1: number;

    offset_x2: number;
    offset_y2: number;
  }

  export type GeneratedSvgData = {
    controlPoints: ITag[];
    elements: SVGElement[];
  };

  export type Sizes = { width: number; height: number };

  export type OffsetFn<TAGS extends string = string> = {
    [v in TAGS]: (sizes: Sizes, controlPoint: SVGControlPoint<TAGS>) => void;
  };

  export class SVGControlPoint<TAGS extends string = string> implements ITag {
    label: TAGS;
    x: number;
    y: number;

    offsetX: number;
    offsetY: number;

    offset_x1: number;
    offset_y1: number;
    offset_x2: number;
    offset_y2: number;

    get children() {
      const results: {
        commands: Command[];
        circles: (SVGElement & { type: 'circle' })[];

        XY1: (Command & { type: 'C' })[];
        XY2: (Command & { type: 'C' })[];
      } = {
        commands: [],
        circles: [],

        XY1: [],
        XY2: [],
      };

      this.parent.elements.forEach((element) => {
        if (element.type === 'path') {
          element.commands.forEach((command) => {
            if (command.tags.includes(this.label)) {
              results.commands.push(command);
            }

            if (command.type === 'C') {
              if (command.tagsXY1.includes(this.label)) {
                results.XY1.push(command);
              }

              if (command.tagsXY2.includes(this.label)) {
                results.XY2.push(command);
              }
            }
          });
        } else if (element.type === 'circle') {
          if (element.tags.includes(this.label)) {
            results.circles.push(element);
          }
        }
      });

      return results;
    }

    constructor(data: ITag, readonly parent: GSVG<TAGS>) {
      this.label = data.label as TAGS;
      this.x = data.x ?? 0;
      this.y = data.y ?? 0;
      this.offsetX = data.offsetX ?? 0;
      this.offsetY = data.offsetY ?? 0;

      this.offset_x1 = data.offset_x1 ?? 0;
      this.offset_y1 = data.offset_y1 ?? 0;
      this.offset_x2 = data.offset_x2 ?? 0;
      this.offset_y2 = data.offset_y2 ?? 0;
    }

    public resetChildOffsets() {
      const children = this.children;

      children.commands.forEach((command) => {
        if (command.type === 'Z') return;

        command.offsetX = 0;
        command.offsetY = 0;
      });

      children.XY1.forEach((command) => {
        command.offset_x1 = 0;
        command.offset_y1 = 0;
      });

      children.XY2.forEach((command) => {
        command.offset_x2 = 0;
        command.offset_y2 = 0;
      });

      children.circles.forEach((circle) => {
        circle.offsetCx = 0;
        circle.offsetCy = 0;
      });
    }

    public applyOffsetToChildren() {
      const children = this.children;

      children.commands.forEach((command) => {
        if (command.type === 'Z') return;

        command.offsetX += this.offsetX;
        command.offsetY += this.offsetY;
      });

      children.XY1.forEach((command) => {
        command.offset_x1 += this.offset_x1;
        command.offset_y1 += this.offset_y1;
      });

      children.XY2.forEach((command) => {
        command.offset_x2 += this.offset_x2;
        command.offset_y2 += this.offset_y2;
      });

      children.circles.forEach((circle) => {
        circle.offsetCx += this.offsetX;
        circle.offsetCy += this.offsetY;
      });
    }
  }

  export class GSVG<TAGS extends string> implements GeneratedSvgData {
    readonly sizes$ = new BehaviorSubject<GeneratedSVG.Sizes>({
      width: 0,
      height: 0,
    });
    // readonly resizeObserver = new ResizeObserver((entries) => {
    //   this.onResize(entries);
    // });

    readonly generatedSvgData$ =
      new BehaviorSubject<GeneratedSVG.GeneratedSvgData>({
        controlPoints: [],
        elements: [],
      });

    get generatedSvgData() {
      return this.generatedSvgData$.value;
    }
    get controlPoints() {
      return this.generatedSvgData.controlPoints as SVGControlPoint<TAGS>[];
    }
    get elements() {
      return this.generatedSvgData.elements;
    }

    // controlPoints: SVGControlPoint<TAGS>[] = [];
    // elements: SVGElement[] = [];

    constructor(
      readonly options: {
        readonly onDestroy: Subject<void>;
        readonly data: GeneratedSvgData;
        readonly controlPointOffsetters: OffsetFn<TAGS>;
      }
    ) {
      const { data } = options;

      const generatedSvgData = this.generatedSvgData$.value;

      generatedSvgData.controlPoints = data.controlPoints.map(
        (tag) => new SVGControlPoint<TAGS>(tag, this)
      );
      generatedSvgData.elements = data.elements;

      this.generatedSvgData$.next(generatedSvgData);

      this.initSizeChanges();
    }

    public recalculate() {
      this.sizes$.next(this.sizes$.value);
    }

    public getControlPointByLabel(label: TAGS) {
      return this.controlPoints.find((cp) => cp.label === label);
    }
    private initSizeChanges() {
      this.sizes$.pipe(takeUntil(this.options.onDestroy)).subscribe((sizes) => {
        this.resetChildOffsets();

        const methods = this.options.controlPointOffsetters;

        for (const key in methods) {
          const point = this.getControlPointByLabel(key);
          if (!point)
            throw new Error(`Control point not found for label: ${key}`);

          if (methods.hasOwnProperty(key)) {
            methods[key](sizes, point);

            point.applyOffsetToChildren();
          }
        }

        this.generatedSvgData$.next(this.generatedSvgData);
      });
    }

    // public observeWrapperElement(wrapper: { nativeElement: HTMLElement }) {
    //   this.resizeObserver.observe(wrapper.nativeElement);
    // }

    public onResize(entries: ResizeObserverEntry[]) {
      this.sizes$.next({
        width: entries[0].target.clientWidth,
        height: entries[0].target.clientHeight,
      });
    }

    public resetChildOffsets() {
      this.controlPoints.forEach((controlPoint) => {
        controlPoint.resetChildOffsets();
      });
    }

    public dispose() {
      //this.resizeObserver.disconnect();
    }
  }
}
