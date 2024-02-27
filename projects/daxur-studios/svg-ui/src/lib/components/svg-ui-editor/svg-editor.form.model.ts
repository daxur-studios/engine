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

  export interface CommandControls {
    type: FormControl<GeneratedSVG.CommandType | null>;
    tags: FormControl<string[] | null>;
    position: PositionGroup;
    isSelected: FormControl<boolean | null>;
  }

  export type CommandGroup = FormGroup<CommandControls>;

  type PositionControls = {
    x: FormControl<number | null>;
    y: FormControl<number | null>;

    offsetX: FormControl<number | null>;
    offsetY: FormControl<number | null>;

    x1: FormControl<number | null>;
    y1: FormControl<number | null>;
    x2: FormControl<number | null>;
    y2: FormControl<number | null>;
  };
  type PositionGroup = FormGroup<PositionControls>;

  export function createCommandGroup(svgCommand: CommandGroup['value']) {
    return new FormGroup<CommandControls>({
      type: new FormControl(svgCommand.type ?? 'M'),
      tags: new FormControl(svgCommand.tags ?? []),
      isSelected: new FormControl(svgCommand.isSelected ?? false),
      position: new FormGroup<PositionControls>({
        x: new FormControl(svgCommand.position?.x ?? 0),
        y: new FormControl(svgCommand.position?.y ?? 0),
        x1: new FormControl(svgCommand.position?.x1 ?? 0),
        x2: new FormControl(svgCommand.position?.x2 ?? 0),
        y1: new FormControl(svgCommand.position?.y1 ?? 0),
        y2: new FormControl(svgCommand.position?.y2 ?? 0),

        offsetX: new FormControl(svgCommand.position?.offsetX ?? 0),
        offsetY: new FormControl(svgCommand.position?.offsetY ?? 0),
      }),
    });
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
            x: c.position?.x ?? 0,
            y: c.position?.y ?? 0,

            offsetX: c.position?.offsetX ?? 0,
            offsetY: c.position?.offsetY ?? 0,
          };
        },
        L: (c) => {
          return {
            type: c.type,
            tags: c.tags || [],
            x: c.position?.x ?? 0,
            y: c.position?.y ?? 0,

            offsetX: c.position?.offsetX ?? 0,
            offsetY: c.position?.offsetY ?? 0,
          };
        },
        C: (c) => {
          return {
            type: c.type,
            tags: c.tags || [],
            x1: c.position?.x1 ?? 0,
            y1: c.position?.y1 ?? 0,
            x2: c.position?.x2 ?? 0,
            y2: c.position?.y2 ?? 0,
            x: c.position?.x ?? 0,
            y: c.position?.y ?? 0,

            offsetX: c.position?.offsetX ?? 0,
            offsetY: c.position?.offsetY ?? 0,
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
