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
        `C ${c.x1} ${c.y1} ${c.x2} ${c.y2} ${c.x + c.offsetX} ${
          c.y + c.offsetY
        }`,
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

  export interface ITag<TAGS extends string = string> {
    label: TAGS;
    x: number;
    y: number;

    offsetX: number;
    offsetY: number;
  }

  export type GeneratedSvgData<TAGS extends string = string> = {
    controlPoints: ITag<TAGS>[];
    elements: SVGElement[];
  };

  export type Sizes = { width: number; height: number };

  export type OffsetFn<TAGS extends string = string> = {
    [v in TAGS]: (sizes: Sizes, controlPoint: SVGControlPoint<TAGS>) => void;
  };

  export class SVGControlPoint<TAGS extends string = string>
    implements ITag<TAGS>
  {
    label: TAGS;
    x: number;
    y: number;

    offsetX: number;
    offsetY: number;

    get children() {
      const results: {
        commands: Command[];
        circles: (SVGElement & { type: 'circle' })[];
      } = {
        commands: [],
        circles: [],
      };

      this.parent.elements.forEach((element) => {
        if (element.type === 'path') {
          results.commands.push(
            ...element.commands.filter((command) =>
              command.tags.includes(this.label)
            )
          );
        } else if (element.type === 'circle') {
          if (element.tags.includes(this.label)) {
            results.circles.push(element);
          }
        }
      });

      return results;
    }

    constructor(data: ITag<TAGS>, readonly parent: GSVG<TAGS>) {
      this.label = data.label;
      this.x = data.x;
      this.y = data.y;
      this.offsetX = data.offsetX;
      this.offsetY = data.offsetY;
    }

    public resetChildOffsets() {
      const children = this.children;

      children.commands.forEach((command) => {
        if (command.type === 'Z') return;

        command.offsetX = 0;
        command.offsetY = 0;
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

      children.circles.forEach((circle) => {
        circle.offsetCx += this.offsetX;
        circle.offsetCy += this.offsetY;
      });
    }
  }

  export class GSVG<TAGS extends string = string> implements GeneratedSvgData {
    controlPoints: SVGControlPoint<TAGS>[] = [];
    elements: SVGElement[] = [];

    constructor(
      readonly options: {
        readonly onDestroy: Subject<void>;
        readonly data: GeneratedSvgData<TAGS>;
        readonly sizes: BehaviorSubject<Sizes>;
        readonly controlPointOffsetters: OffsetFn<TAGS>;
      }
    ) {
      const { data } = options;
      this.controlPoints = data.controlPoints.map(
        (tag) => new SVGControlPoint<TAGS>(tag, this)
      );
      this.elements = data.elements;

      this.initSizeChanges();
    }

    public getControlPointByLabel(label: TAGS) {
      return this.controlPoints.find((cp) => cp.label === label);
    }
    private initSizeChanges() {
      this.options.sizes
        .pipe(takeUntil(this.options.onDestroy))
        .subscribe((sizes) => {
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
        });
    }

    public resetChildOffsets() {
      this.controlPoints.forEach((controlPoint) => {
        controlPoint.resetChildOffsets();
      });
    }
  }
}
