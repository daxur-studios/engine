import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GeneratedSVG } from '../../models';

export module GeneratedSvgForm {
  interface GeneratedSvgFormControls {
    uniqueTags: FormControl<GeneratedSVG.ITag[] | null>;
    elements: FormArray<SvgInputGroup>;
  }
  export type GeneratedSvgFormGroup = FormGroup<GeneratedSvgFormControls>;
  export function createGeneratedSvgFormGroup(
    svgFormValue?: GeneratedSvgFormGroup['value']
  ) {
    return new FormGroup<GeneratedSvgFormControls>({
      uniqueTags: new FormControl(svgFormValue?.uniqueTags || []),
      elements: createSvgInputFormArray(svgFormValue?.elements),
    });
  }

  //#region Command

  export type CommandControls = {
    type: FormControl<GeneratedSVG.CommandType | null>;
    tags: FormControl<string[] | null>;

    x: FormControl<number | null>;
    y: FormControl<number | null>;
    offsetX: FormControl<number | null>;
    offsetY: FormControl<number | null>;

    isSelected: FormControl<boolean | null>;
  } & (
    | MoveToCommandControls
    | LineToCommandControls
    | CurveCommandControls
    | ClosePathCommandControls
  );

  export type MoveToCommandControls = {
    type: FormControl<'M' | null>;
  };
  export type LineToCommandControls = {
    type: FormControl<'L' | null>;
  };
  export type ClosePathCommandControls = {
    type: FormControl<'Z' | null>;
  };

  export type CurveCommandControls = {
    type: FormControl<'C' | null>;
    tagsXY1: FormControl<string[] | null>;
    tagsXY2: FormControl<string[] | null>;

    x1: FormControl<number | null>;
    y1: FormControl<number | null>;
    x2: FormControl<number | null>;
    y2: FormControl<number | null>;

    offset_x1: FormControl<number | null>;
    offset_y1: FormControl<number | null>;
    offset_x2: FormControl<number | null>;
    offset_y2: FormControl<number | null>;
  };

  export type CommandGroup = FormGroup<CommandControls>;

  export function isCurveCommandControls(
    controls: CommandControls
  ): controls is CommandControls & CurveCommandControls {
    return controls.type.value === 'C';
  }

  export function createCommandGroup(svgCommand: CommandGroup['value']) {
    if (svgCommand.type === 'C') {
      return new FormGroup<CommandControls>({
        type: new FormControl(svgCommand.type ?? 'C'),
        isSelected: new FormControl(svgCommand.isSelected ?? false),
        tags: new FormControl(svgCommand.tags ?? []),
        tagsXY1: new FormControl(svgCommand.tagsXY1 ?? []),
        tagsXY2: new FormControl(svgCommand.tagsXY2 ?? []),

        x1: new FormControl(svgCommand?.x1 ?? 0),
        x2: new FormControl(svgCommand?.x2 ?? 0),
        y1: new FormControl(svgCommand?.y1 ?? 0),
        y2: new FormControl(svgCommand?.y2 ?? 0),

        x: new FormControl(svgCommand?.x ?? 0),
        y: new FormControl(svgCommand?.y ?? 0),

        offsetX: new FormControl(svgCommand?.offsetX ?? 0),
        offsetY: new FormControl(svgCommand?.offsetY ?? 0),
        offset_x1: new FormControl(svgCommand?.offset_x1 ?? 0),
        offset_y1: new FormControl(svgCommand?.offset_y1 ?? 0),
        offset_x2: new FormControl(svgCommand?.offset_x2 ?? 0),
        offset_y2: new FormControl(svgCommand?.offset_y2 ?? 0),
      });
    } else {
      return new FormGroup<CommandControls>({
        type: new FormControl((svgCommand.type as any) ?? 'M'),
        tags: new FormControl(svgCommand.tags ?? []),
        isSelected: new FormControl(svgCommand.isSelected ?? false),

        x: new FormControl(svgCommand?.x ?? 0),
        y: new FormControl(svgCommand?.y ?? 0),

        offsetX: new FormControl(svgCommand?.offsetX ?? 0),
        offsetY: new FormControl(svgCommand?.offsetY ?? 0),
      });
    }
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
            tags: c.tags || [],
            x: c?.x ?? 0,
            y: c?.y ?? 0,

            offsetX: c?.offsetX ?? 0,
            offsetY: c?.offsetY ?? 0,
          };
        },
        L: (c) => {
          return {
            type: c.type,
            tags: c.tags || [],
            x: c?.x ?? 0,
            y: c?.y ?? 0,

            offsetX: c?.offsetX ?? 0,
            offsetY: c?.offsetY ?? 0,
          };
        },
        C: (c) => {
          return {
            type: c.type,
            tags: c.tags || [],
            x1: c?.x1 ?? 0,
            y1: c?.y1 ?? 0,
            x2: c?.x2 ?? 0,
            y2: c?.y2 ?? 0,
            x: c?.x ?? 0,
            y: c?.y ?? 0,

            offsetX: c?.offsetX ?? 0,
            offsetY: c?.offsetY ?? 0,

            offset_x1: c?.offset_x1 ?? 0,
            offset_y1: c?.offset_y1 ?? 0,
            offset_x2: c?.offset_x2 ?? 0,
            offset_y2: c?.offset_y2 ?? 0,

            tagsXY1: c.tagsXY1 || [],
            tagsXY2: c.tagsXY2 || [],
          };
        },
        Z: (c) => {
          return {
            type: c.type,
            tags: c.tags || [],
          };
        },
      };

      return formatters[value.type!](value as any);
    });

    return commands;
  }
  export function toGeneratedSvgElement(
    svgInputGroup: SvgInputGroup
  ): GeneratedSVG.SVGElement | undefined {
    const value = svgInputGroup.value;

    if (isSvgPathControls(svgInputGroup.controls) && value.type === 'path') {
      return {
        type: 'path',
        fill: value.fill ?? '#000000',
        stroke: value.stroke ?? '#a0a0a0',
        strokeWidth: value.strokeWidth || '1',
        commands: toSvgCommands(svgInputGroup.controls.commands),
        closePath: value.closePath ?? true,
      };
    } else if (value.type === 'circle') {
      return {
        type: 'circle',
        tags: value.tags || [],
        cx: value.cx || 0,
        cy: value.cy || 0,
        offsetCx: value.offsetCx || 0,
        offsetCy: value.offsetCy || 0,
        fill: value.fill ?? '#000000',
        r: value.r || 0,
        stroke: value.stroke ?? '#a0a0a0',
        strokeWidth: value.strokeWidth || '1',
      };
    } else {
      return undefined;
    }
  }
  export function toGeneratedSvgData(
    group: GeneratedSvgFormGroup
  ): GeneratedSVG.GeneratedSvgData {
    return {
      controlPoints: group.value.uniqueTags || [],
      elements: group.controls.elements.controls
        .map(toGeneratedSvgElement)
        .filter((x) => !!x) as GeneratedSVG.SVGElement[],
    };
  }

  //#endregion

  //#region Generated SVG

  export type SvgInputControls = {
    type: FormControl<GeneratedSVG.SvgInputType | null>;
    tags: FormControl<string[] | null>;
  } & (SvgPathControls | CircleControls);

  export type SvgInputGroup = FormGroup<SvgInputControls>;

  export interface SvgPathControls {
    type: FormControl<'path' | null>;
    tags: FormControl<string[] | null>;
    fill: FormControl<string | null>;
    stroke: FormControl<string | null>;
    strokeWidth: FormControl<string | null>;
    commands: FormArray<CommandGroup>;

    closePath: FormControl<boolean | null>;
  }

  //#region Type Guards
  export function isSvgPathGroup(group: SvgInputGroup): group is SvgInputGroup {
    return group.value.type === 'path';
  }

  export function isSvgPathControls(
    controls: SvgInputControls
  ): controls is SvgPathControls {
    return controls.type.value === 'path';
  }

  export function isCircleControls(
    controls: SvgInputControls
  ): controls is CircleControls {
    return controls.type.value === 'circle';
  }
  //#endregion

  export function createSvgInputGroup(
    input?: SvgInputGroup['value']
  ): SvgInputGroup {
    if (input?.type === 'path') {
      return new FormGroup<SvgInputControls>({
        type: new FormControl('path'),
        tags: new FormControl(input?.tags || []),
        fill: new FormControl(input?.fill ?? '#000000'),
        stroke: new FormControl(input?.stroke ?? '#a0a0a0'),
        strokeWidth: new FormControl(input?.strokeWidth || '1'),
        commands: new FormArray<CommandGroup>(
          (input?.commands || []).map((command) => createCommandGroup(command))
        ),
        closePath: new FormControl(input?.closePath || true),
      });
    } else if (input?.type === 'circle') {
      return createCircleGroup(input);
    } else {
      throw new Error('Invalid SVG Input Type ' + input?.type);
    }
  }

  export type SvgInputFormArray = FormArray<SvgInputGroup>;
  export function createSvgInputFormArray(
    inputs: FormArray<SvgInputGroup>['value'] | undefined
  ) {
    return new FormArray<SvgInputGroup>(inputs?.map(createSvgInputGroup) || []);
  }

  //#region Circle
  type CircleControls = {
    [v in keyof GeneratedSVG.Circle]: FormControl<
      GeneratedSVG.Circle[v] | null
    >;
  };

  export function createCircleGroup(
    input?: SvgInputGroup['value'] & { type: 'circle' | null | undefined }
  ) {
    if (!input?.type) {
      throw new Error('Circle type not provided');
    }
    return new FormGroup<SvgInputControls>({
      type: new FormControl('circle'),
      tags: new FormControl(input?.tags || []),
      cx: new FormControl(input?.cx || 0),
      cy: new FormControl(input?.cy || 0),
      offsetCx: new FormControl(input?.offsetCx || 0),
      offsetCy: new FormControl(input?.offsetCy || 0),
      r: new FormControl(input?.r || 0),
      fill: new FormControl(input?.fill ?? '#000000'),
      stroke: new FormControl(input?.stroke ?? '#a0a0a0'),
      strokeWidth: new FormControl(input?.strokeWidth || '1'),
    });
  }
  //#endregion

  export function exportAsJson(group: GeneratedSvgFormGroup) {
    return JSON.stringify(group.value, null, 2);
  }

  export function importFromJson(
    group: GeneratedSvgFormGroup,
    jsonFormValue: GeneratedSvgFormGroup['value']
  ) {
    try {
      group.controls.elements.clear();
      group.patchValue(jsonFormValue);

      //  createGeneratedSvgFormGroup(jsonFormValue);

      jsonFormValue.elements?.forEach((input, i) => {
        group.controls.elements.push(createSvgInputGroup(input));
      });
    } catch (error) {
      console.error('Error importing from JSON', error);
    }
  }
  //#endregion
}
