import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GeneratedSVG } from '../../models';

export module GeneratedSvgForm {
  //#region Command

  export interface CommandControls {
    type: FormControl<GeneratedSVG.CommandType | null>;
    position: PositionGroup;
    isSelected: FormControl<boolean | null>;
  }

  export type CommandGroup = FormGroup<CommandControls>;

  type PositionControls = {
    x: FormControl<number | null>;
    y: FormControl<number | null>;

    x1: FormControl<number | null>;
    y1: FormControl<number | null>;
    x2: FormControl<number | null>;
    y2: FormControl<number | null>;
  };
  type PositionGroup = FormGroup<PositionControls>;

  export function createCommandGroup(svgCommand: CommandGroup['value']) {
    return new FormGroup<CommandControls>({
      type: new FormControl(svgCommand.type ?? 'M'),
      isSelected: new FormControl(svgCommand.isSelected ?? false),
      position: new FormGroup<PositionControls>({
        x: new FormControl(svgCommand.position?.x ?? 0),
        y: new FormControl(svgCommand.position?.y ?? 0),
        x1: new FormControl(svgCommand.position?.x1 ?? 0),
        x2: new FormControl(svgCommand.position?.x2 ?? 0),
        y1: new FormControl(svgCommand.position?.y1 ?? 0),
        y2: new FormControl(svgCommand.position?.y2 ?? 0),
      }),
    });
  }

  /**
   * Convert the commands form array to a path data string that can be used in an svg path element's `d` attribute.
   */
  export function commandsFormArrayToPathData(
    commandsFormArray: FormArray<CommandGroup>
  ): string {
    let d = '';

    for (let i = 0; i < commandsFormArray.length; i++) {
      const command = commandsFormArray.at(i);

      if (i === 0) {
        d += `M ${command.get('position.x')?.value} ${
          command.get('position.y')?.value
        }`;
      } else {
        d += ` L ${command.get('position.x')?.value} ${
          command.get('position.y')?.value
        }`;
      }
    }

    d += ' Z';

    return d;
  }
  export function toSvgCommands(
    commandsFormArray: FormArray<CommandGroup>
  ): GeneratedSVG.Command[] {
    const values = commandsFormArray.value;
    const commands: GeneratedSVG.Command[] = values.map((value) => {
      const formatters: {
        [TYPE in GeneratedSVG.CommandType]: (
          c: CommandGroup['value'] & { type: TYPE }
        ) => GeneratedSVG.Command;
      } = {
        M: (c) => {
          return {
            type: c.type,
            x: c.position?.x ?? 0,
            y: c.position?.y ?? 0,
          };
        },
        L: (c) => {
          return {
            type: c.type,
            x: c.position?.x ?? 0,
            y: c.position?.y ?? 0,
          };
        },
        C: (c) => {
          return {
            type: c.type,
            x1: c.position?.x1 ?? 0,
            y1: c.position?.y1 ?? 0,
            x2: c.position?.x2 ?? 0,
            y2: c.position?.y2 ?? 0,
            x: c.position?.x ?? 0,
            y: c.position?.y ?? 0,
          };
        },
        Z: (c) => {
          return {
            type: c.type,
          };
        },
      };

      return formatters[value.type!](value as any);
    });

    return commands;
  }
  export function toSvgPath(svgPathGroup: SvgPathGroup): GeneratedSVG.Path {
    const value = svgPathGroup.value;
    return {
      type: 'path',
      fill: value.fill || '#000000',
      stroke: value.stroke || '#a0a0a0',
      strokeWidth: value.strokeWidth || '1',
      commands: toSvgCommands(svgPathGroup.controls.commands),
    };
  }

  //#endregion

  //#region Generated SVg
  export interface SvgPathControls {
    fill: FormControl<string | null>;
    stroke: FormControl<string | null>;
    strokeWidth: FormControl<string | null>;
    commands: FormArray<CommandGroup>;
  }
  export type SvgPathGroup = FormGroup<SvgPathControls>;

  export function createSvgPathGroup(svgPath?: SvgPathGroup['value']) {
    return new FormGroup<SvgPathControls>({
      fill: new FormControl(svgPath?.fill || '#000000'),
      stroke: new FormControl(svgPath?.stroke || '#a0a0a0'),
      strokeWidth: new FormControl(svgPath?.strokeWidth || '1'),
      commands: new FormArray<CommandGroup>(
        (svgPath?.commands || []).map((command) => createCommandGroup(command))
      ),
    });
  }

  export type SvgPathFormArray = FormArray<SvgPathGroup>;
  export function createSvgPathFormArray() {
    return new FormArray<SvgPathGroup>([]);
  }

  export function exportAsJson(svgPathFormArray: SvgPathFormArray) {
    return JSON.stringify(svgPathFormArray.value, null, 2);
  }

  export function importFromJson(
    svgPathFormArray: SvgPathFormArray,
    json: typeof svgPathFormArray.value
  ) {
    try {
      svgPathFormArray.clear();
      //generatedSvgGroup.controls.commands.clear({ emitEvent: false });

      json.forEach((path, i) => {
        svgPathFormArray.push(createSvgPathGroup(path));
      });
    } catch (error) {
      console.error('Error importing from JSON', error);
    }
  }
  //#endregion
}
