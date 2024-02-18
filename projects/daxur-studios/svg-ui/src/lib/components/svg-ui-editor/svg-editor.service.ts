import { Injectable, WritableSignal, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GeneratedSvgForm } from './svg-editor.form.model';
import { GeneratedSVG } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SvgEditorService {
  readonly svgPathFormArray = GeneratedSvgForm.createSvgPathFormArray();
  readonly currentPathGroup = signal<GeneratedSvgForm.SvgPathGroup | undefined>(
    undefined
  );
  // readonly generatedSvgGroup = GeneratedSvgForm.createDynamicSvgGroup();
  // readonly commandsFormArray = this.generatedSvgGroup.controls.commands;

  // readonly selectedCommandGroups: WritableSignal<
  //   GeneratedSvgForm.CommandGroup[]
  // > = signal([]);

  // readonly commands: WritableSignal<GeneratedSVG.Command[][]> = signal([]);
  readonly paths: WritableSignal<GeneratedSVG.Path[]> = signal([]);

  constructor() {
    this.initValueChangeListeners();
  }

  private initValueChangeListeners() {
    this.svgPathFormArray.valueChanges.subscribe(() => {
      // this.selectedCommandGroups.set(
      //   this.commandsFormArray.controls.filter(
      //     (control) => control.value.isSelected
      //   )
      // );

      const paths: GeneratedSVG.Path[] = [];

      this.svgPathFormArray.controls.forEach((svgPathGroup) => {
        paths.push(GeneratedSvgForm.toSvgPath(svgPathGroup));
      });

      this.paths.set(paths);

      this.updateEditorOnlySvgCommands();
      console.debug('commands', this.paths());
    });

    this.svgPathFormArray.valueChanges.subscribe((v) => {
      console.debug('generatedSvgGroup', v);
    });
  }

  setCurrentPathFormGroup(group: GeneratedSvgForm.SvgPathGroup) {
    this.currentPathGroup.set(group);
  }

  private updateEditorOnlySvgCommands() {
    const editorOnlyPaths: GeneratedSVG.Path[] = [];

    this.svgPathFormArray.controls.forEach((svgPathGroup) => {
      svgPathGroup.controls.commands.controls.forEach(
        (selectedCommandGroup, i) => {
          if (
            selectedCommandGroup.value.type === 'C' &&
            selectedCommandGroup.value.isSelected
          ) {
            const previousControl = svgPathGroup.controls.commands.controls.at(
              i - 1
            );
            const control = selectedCommandGroup;
            const position = control.value.position;
            editorOnlyPaths.push({
              type: 'path',
              fill: '#000000',
              stroke: '#b02e0c',
              strokeWidth: '1',
              commands: [
                //#region Connect to previous point
                {
                  type: 'M',
                  x: position?.x1 ?? 0,
                  y: position?.y1 ?? 0,
                },
                {
                  type: 'L',
                  x: previousControl?.value.position?.x ?? 0,
                  y: previousControl?.value.position?.y ?? 0,
                },
                //#endregion
                //#region Connect to current point
                {
                  type: 'M',
                  x: position?.x2 ?? 0,
                  y: position?.y2 ?? 0,
                },
                {
                  type: 'L',
                  x: position?.x ?? 0,
                  y: position?.y ?? 0,
                },
                {
                  type: 'M',
                  x: position?.x ?? 0,
                  y: position?.y ?? 0,
                },
                //#endregion
              ],
            });

            this.paths.update((paths) => {
              paths.push(...editorOnlyPaths);
              return paths;
            });
          }
        }
      );
    });
  }

  addPath(group: GeneratedSvgForm.SvgPathGroup) {
    this.svgPathFormArray.push(group);
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
    const json = GeneratedSvgForm.exportAsJson(this.svgPathFormArray);
    navigator.clipboard.writeText(json);
  }
  importFromJson(jsonString: string = prompt('Paste JSON here') ?? '') {
    const json = JSON.parse(jsonString);
    GeneratedSvgForm.importFromJson(this.svgPathFormArray, json);
    this.setCurrentPathFormGroup(this.svgPathFormArray.controls[0]);
  }
}
