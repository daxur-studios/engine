import { Component } from '@angular/core';
import { SvgEditorService } from '../svg-editor.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneratedSVG } from '../../../models';
import { GeneratedSvgForm } from '../svg-editor.form.model';
import { SvgEditorInputComponent } from './svg-editor-input/svg-editor-input.component';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-svg-ui-editor-sidebar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SvgEditorInputComponent,
    MatChipsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './svg-ui-editor-sidebar.component.html',
  styleUrl: './svg-ui-editor-sidebar.component.scss',
})
export class SvgUiEditorSidebarComponent {
  readonly generatedSvgFormGroup = this.svgEditorService.generatedSvgFormGroup;
  readonly svgInputFormArray = this.svgEditorService.svgInputFormArray;
  readonly currentSvgInputGroup = this.svgEditorService.currentSvgInputGroup;

  readonly GeneratedSVG = GeneratedSVG;
  readonly GeneratedSvgForm = GeneratedSvgForm;

  constructor(readonly svgEditorService: SvgEditorService) {}

  get uniqueTags() {
    return this.generatedSvgFormGroup.controls.uniqueTags;
  }

  removeTag(tag: GeneratedSVG.ITag) {
    this.uniqueTags.setValue(
      this.uniqueTags.value?.filter((t) => t.label !== tag.label) || []
    );
  }
  addTag(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value?.trim() || '';
    if (!value) return;

    const tag: GeneratedSVG.ITag = {
      label: value,
      x: 10,
      y: 10,
      offsetX: 0,
      offsetY: 0,
      offset_x1: 0,
      offset_y1: 0,
      offset_x2: 0,
      offset_y2: 0,
    };

    const existingTags = this.uniqueTags.value || [];

    this.generatedSvgFormGroup.controls.uniqueTags.setValue(
      // Ensure tags are unique by label
      [...existingTags, tag].filter(
        (t, i, a) => a.findIndex((tag) => tag.label === t.label) === i
      )
    );

    if (input) {
      input.value = '';
    }
  }
  addInput(type: GeneratedSVG.SvgInputType) {
    this.svgEditorService.addInput(
      GeneratedSvgForm.createSvgInputGroup({ type: type })
    );

    this.svgEditorService.setCurrentSvgInputFormGroup(
      this.svgEditorService.svgInputFormArray.at(
        this.svgEditorService.svgInputFormArray.length - 1
      )
    );
  }

  setCurrentSvgInputGroup(group: GeneratedSvgForm.SvgInputGroup) {
    this.svgEditorService.setCurrentSvgInputFormGroup(group);
  }

  addPoint(group: GeneratedSvgForm.SvgInputGroup) {
    if (GeneratedSvgForm.isSvgPathControls(group.controls))
      this.svgEditorService.addPoint(group.controls.commands);
  }

  exportAsJson() {
    this.svgEditorService.exportAsJson();
  }
  importFromJson() {
    this.svgEditorService.importFromJson();
  }

  TEST() {
    this.svgEditorService.svgInputFormArray.clear();

    const group = GeneratedSvgForm.createSvgInputGroup({ type: 'path' });
    this.svgEditorService.addInput(group);
    this.svgEditorService.setCurrentSvgInputFormGroup(group);

    const x = document.querySelector('lib-html-map');

    /**
     * Minimum 3 points, maximum 10 points
     */
    const count = Math.round(Math.random() * 7) + 3;

    for (let i = 0; i < count; i++) {
      if (GeneratedSvgForm.isSvgPathControls(group.controls)) {
        this.svgEditorService.addPoint(group.controls.commands, {
          x: Math.round(Math.random() * (x?.clientWidth ?? 200)),
          y: Math.round(Math.random() * (x?.clientHeight ?? 200)),
        });
      }
    }

    this.svgEditorService.generatedSvgFormGroup.patchValue({
      uniqueTags: [
        {
          label: 'test',
          x: Math.round(Math.random() * (x?.clientWidth ?? 200)),
          y: Math.round(Math.random() * (x?.clientHeight ?? 200)),
          offsetX: 0,
          offsetY: 0,
          offset_x1: 0,
          offset_y1: 0,
          offset_x2: 0,
          offset_y2: 0,
        },
        {
          label: 'test2',
          x: Math.round(Math.random() * (x?.clientWidth ?? 200)),
          y: Math.round(Math.random() * (x?.clientHeight ?? 200)),
          offsetX: 0,
          offsetY: 0,
          offset_x1: 0,
          offset_y1: 0,
          offset_x2: 0,
          offset_y2: 0,
        },
      ],
    });
  }
}
