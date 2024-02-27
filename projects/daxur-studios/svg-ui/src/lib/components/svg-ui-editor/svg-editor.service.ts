import { Injectable, WritableSignal, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GeneratedSvgForm } from './svg-editor.form.model';
import { GeneratedSVG } from '../../models';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SvgEditorService {
  readonly generatedSvgFormGroup =
    GeneratedSvgForm.createGeneratedSvgFormGroup();
  readonly svgInputFormArray = this.generatedSvgFormGroup.controls.elements;

  readonly currentSvgInputGroup = signal<
    GeneratedSvgForm.SvgInputGroup | undefined
  >(undefined);

  // readonly uniqueTags = signal<GeneratedSVG.ITag[]>([]);

  readonly generatedSvgData =
    new BehaviorSubject<GeneratedSVG.GeneratedSvgData>({
      elements: [],
      controlPoints: [],
    });

  constructor() {
    this.initValueChangeListeners();
  }

  private initValueChangeListeners() {
    // this.generatedSvgFormGroup.controls.uniqueTags.valueChanges.subscribe(
    //   (v) => {
    //     this.uniqueTags.set(v || []);
    //   }
    // );

    this.svgInputFormArray.valueChanges.subscribe((values) => {
      const elements: GeneratedSVG.SVGElement[] = [];

      this.svgInputFormArray.controls.forEach((svgInputGroup) => {
        const input = GeneratedSvgForm.toGeneratedSvgElement(svgInputGroup);
        if (input) elements.push(input);
      });

      this.generatedSvgData.next({
        elements: elements,
        controlPoints:
          this.generatedSvgFormGroup.controls.uniqueTags.value || [],
      });

      this.updateEditorOnlySvgCommands();
      console.debug('generatedSvgData', this.generatedSvgData.value);
      console.debug('generatedSvgFormGroup', this.generatedSvgFormGroup.value);
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

                  offsetX: position?.offsetX ?? 0,
                  offsetY: position?.offsetY ?? 0,
                },
                {
                  type: 'L',
                  tags: [],
                  x: previousControl?.value.position?.x ?? 0,
                  y: previousControl?.value.position?.y ?? 0,

                  offsetX: previousControl?.value.position?.offsetX ?? 0,
                  offsetY: previousControl?.value.position?.offsetY ?? 0,
                },
                //#endregion
                //#region Connect to current point
                {
                  type: 'M',
                  tags: [],
                  x: position?.x2 ?? 0,
                  y: position?.y2 ?? 0,

                  offsetX: position?.offsetX ?? 0,
                  offsetY: position?.offsetY ?? 0,
                },
                {
                  type: 'L',
                  tags: [],
                  x: position?.x ?? 0,
                  y: position?.y ?? 0,

                  offsetX: position?.offsetX ?? 0,
                  offsetY: position?.offsetY ?? 0,
                },
                {
                  type: 'M',
                  tags: [],
                  x: position?.x ?? 0,
                  y: position?.y ?? 0,

                  offsetX: position?.offsetX ?? 0,
                  offsetY: position?.offsetY ?? 0,
                },
                //#endregion
              ],
            });

            const data = this.generatedSvgData.value;
            data.elements.push(...editorOnlyPaths);
            this.generatedSvgData.next(data);
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
