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
  }
  export interface LineToCommand {
    type: 'L';
    x: number;
    y: number;
  }

  export interface CurveToCommand {
    type: 'C';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
  }

  export interface ClosePathCommand {
    type: 'Z';
  }

  export function commandToString(command: Command): string {
    const formatters: {
      [TYPE in CommandType]: (c: Command & { type: TYPE }) => string;
    } = {
      M: (c) => `M ${c.x} ${c.y}`,
      L: (c) => `L ${c.x} ${c.y}`,
      C: (c) => `C ${c.x1} ${c.y1} ${c.x2} ${c.y2} ${c.x} ${c.y}`,
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
    r: number;
    fill: string;
    stroke: string;
    strokeWidth: string;
  }

  export type SVGInput = {
    type: SvgInputType;
  } & (Path | Circle);
}
