import { Component } from '@angular/core';
import { SvgEditorService } from '../svg-editor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneratedSVG } from '../../../models';
import { GeneratedSvgForm } from '../svg-editor.form.model';

@Component({
  selector: 'lib-svg-ui-editor-sidebar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './svg-ui-editor-sidebar.component.html',
  styleUrl: './svg-ui-editor-sidebar.component.scss',
})
export class SvgUiEditorSidebarComponent {
  get svgPathFormArray() {
    return this.svgEditorService.svgPathFormArray;
  }
  get currentPathGroup() {
    return this.svgEditorService.currentPathGroup;
  }

  readonly TYPE_OPTIONS = GeneratedSVG.TYPE_OPTIONS;

  constructor(readonly svgEditorService: SvgEditorService) {}

  addPath() {
    this.svgEditorService.addPath(GeneratedSvgForm.createSvgPathGroup());
    this.svgEditorService.setCurrentPathFormGroup(
      this.svgEditorService.svgPathFormArray.at(
        this.svgEditorService.svgPathFormArray.length - 1
      )
    );
  }
  addCircle() {}

  setCurrentPathFormGroup(group: GeneratedSvgForm.SvgPathGroup) {
    this.svgEditorService.setCurrentPathFormGroup(group);
  }

  addPoint(group: GeneratedSvgForm.SvgPathGroup) {
    this.svgEditorService.addPoint(group.controls.commands);
  }
  removePoint(group: GeneratedSvgForm.SvgPathGroup, i: number) {
    this.svgEditorService.removePoint(group.controls.commands, i);
  }

  exportAsJson() {
    this.svgEditorService.exportAsJson();
  }
  importFromJson() {
    this.svgEditorService.importFromJson();
  }

  TEST() {
    this.svgEditorService.svgPathFormArray.clear();

    const group = GeneratedSvgForm.createSvgPathGroup();
    this.svgEditorService.addPath(group);
    this.svgEditorService.setCurrentPathFormGroup(group);
    /**
     * Minimum 3 points, maximum 10 points
     */
    const count = Math.round(Math.random() * 7) + 3;

    for (let i = 0; i < count; i++) {
      this.svgEditorService.addPoint(group.controls.commands, {
        x: Math.round(Math.random() * 200),
        y: Math.round(Math.random() * 400),
      });
    }
  }
}
