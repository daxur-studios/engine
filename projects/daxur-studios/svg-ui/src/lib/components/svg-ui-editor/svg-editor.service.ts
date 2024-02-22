import { Injectable, WritableSignal, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GeneratedSvgForm } from './svg-editor.form.model';
import { GeneratedSVG } from '../../models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SvgEditorService {
  readonly generatedSvgFormGroup =
    GeneratedSvgForm.createGeneratedSvgFormGroup();
  readonly svgInputFormArray = this.generatedSvgFormGroup.controls.svgInputs;

  readonly currentSvgInputGroup = signal<
    GeneratedSvgForm.SvgInputGroup | undefined
  >(undefined);

  readonly uniqueTags = signal<string[]>([]);

  // readonly generatedSvgGroup = GeneratedSvgForm.createDynamicSvgGroup();
  // readonly commandsFormArray = this.generatedSvgGroup.controls.commands;

  // readonly selectedCommandGroups: WritableSignal<
  //   GeneratedSvgForm.CommandGroup[]
  // > = signal([]);

  // readonly commands: WritableSignal<GeneratedSVG.Command[][]> = signal([]);
  readonly inputs: WritableSignal<GeneratedSVG.SVGInput[]> = signal([]);

  constructor() {
    this.initValueChangeListeners();
  }

  private initValueChangeListeners() {
    this.generatedSvgFormGroup.controls.uniqueTags.valueChanges.subscribe(
      (v) => {
        this.uniqueTags.set(v || []);
      }
    );

    this.svgInputFormArray.valueChanges.subscribe((values) => {
      const inputs: GeneratedSVG.SVGInput[] = [];

      this.svgInputFormArray.controls.forEach((svgInputGroup) => {
        const input = GeneratedSvgForm.toGeneratedSvgInput(svgInputGroup);
        if (input) inputs.push(input);
      });

      this.inputs.set(inputs);

      this.updateEditorOnlySvgCommands();
      console.debug('commands', this.inputs());
    });

    this.svgInputFormArray.valueChanges.subscribe((v) => {
      console.debug('generatedSvgGroup', v);
    });
  }

  setCurrentSvgInputFormGroup(group: GeneratedSvgForm.SvgInputGroup) {
    this.currentSvgInputGroup.set(group);
  }

  private updateEditorOnlySvgCommands() {
    const editorOnlyPaths: GeneratedSVG.Path[] = [];

    this.svgInputFormArray.controls.forEach((svgInputGroup) => {
      if (GeneratedSvgForm.isSvgPathControls(svgInputGroup.controls)) {
        for (
          let i = 0;
          i < svgInputGroup.controls.commands.controls.length;
          i++
        ) {
          const selectedCommandGroup =
            svgInputGroup.controls.commands.controls.at(i)!;
          if (
            selectedCommandGroup.value.type === 'C' &&
            selectedCommandGroup.value.isSelected
          ) {
            const previousControl = svgInputGroup.controls.commands.controls.at(
              i - 1
            );

            const control = selectedCommandGroup;
            const position = control.value.position;
            editorOnlyPaths.push({
              type: 'path',
              fill: '#000000',
              stroke: '#b02e0c',
              strokeWidth: '1',
              closePath: false,
              commands: [
                //#region Connect to previous point
                {
                  type: 'M',
                  tags: [],
                  x: position?.x1 ?? 0,
                  y: position?.y1 ?? 0,
                },
                {
                  type: 'L',
                  tags: [],
                  x: previousControl?.value.position?.x ?? 0,
                  y: previousControl?.value.position?.y ?? 0,
                },
                //#endregion
                //#region Connect to current point
                {
                  type: 'M',
                  tags: [],
                  x: position?.x2 ?? 0,
                  y: position?.y2 ?? 0,
                },
                {
                  type: 'L',
                  tags: [],
                  x: position?.x ?? 0,
                  y: position?.y ?? 0,
                },
                {
                  type: 'M',
                  tags: [],
                  x: position?.x ?? 0,
                  y: position?.y ?? 0,
                },
                //#endregion
              ],
            });

            this.inputs.update((paths) => {
              paths.push(...editorOnlyPaths);
              return paths;
            });
          }
        }
      }
    });
  }

  addInput(group: GeneratedSvgForm.SvgInputGroup) {
    this.svgInputFormArray.push(group);
  }

  addPoint(
    commandsFormArray: FormArray<GeneratedSvgForm.CommandGroup>,
    position?: { x: number; y: number }
  ) {
    const length = commandsFormArray.length;

    commandsFormArray.push(
      GeneratedSvgForm.createCommandGroup({
        type: length === 0 ? 'M' : 'L',
        position: position,
      })
    );
  }
  removePoint(
    commandsFormArray: FormArray<GeneratedSvgForm.CommandGroup>,
    i: number
  ) {
    commandsFormArray.removeAt(i);
  }

  exportAsJson() {
    const json = GeneratedSvgForm.exportAsJson(this.generatedSvgFormGroup);
    navigator.clipboard.writeText(json);
  }
  importFromJson(jsonString: string = prompt('Paste JSON here') ?? '') {
    const json = JSON.parse(jsonString);
    GeneratedSvgForm.importFromJson(this.generatedSvgFormGroup, json);
    this.setCurrentSvgInputFormGroup(this.svgInputFormArray.controls[0]);
  }
}
