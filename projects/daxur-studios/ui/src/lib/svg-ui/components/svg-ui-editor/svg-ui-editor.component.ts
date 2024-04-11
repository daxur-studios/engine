import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HtmlMapComponent } from '../../../graph';
import { GeneratedSVG } from '../../models';
import { GeneratedSvgComponent } from '../generated-svg/generated-svg.component';
import { GeneratedSvgForm } from './svg-editor.form.model';
import { SvgEditorService } from './svg-editor.service';
import { SvgUiEditorSidebarComponent } from './svg-ui-editor-sidebar/svg-ui-editor-sidebar.component';

@Component({
  selector: 'lib-svg-ui-editor',
  standalone: true,
  imports: [
    CommonModule,
    HtmlMapComponent,
    SvgUiEditorSidebarComponent,
    GeneratedSvgComponent,
    DragDropModule,
    MatTooltipModule,
  ],
  templateUrl: './svg-ui-editor.component.html',
  styleUrl: './svg-ui-editor.component.scss',
})
export class SvgUiEditorComponent implements SVGEditor {
  readonly GeneratedSvgForm = GeneratedSvgForm;

  readonly generatedSvgFormGroup = this.svgEditorService.generatedSvgFormGroup;
  readonly svgInputFormArray = this.svgEditorService.svgInputFormArray;
  readonly inputs = this.svgEditorService.generatedSvgData;

  constructor(readonly svgEditorService: SvgEditorService) {}

  import() {}
  export() {}
  select(i: number) {}
  pathClick() {}
  isSelected(i: number) {
    return false;
  }
  circleClicked(group: GeneratedSvgForm.CommandGroup) {
    group.controls.isSelected.setValue(!group.controls.isSelected.value);
  }
  dragEnded(event: CdkDragEnd, group: GeneratedSvgForm.CommandGroup) {
    group.patchValue({
      x: event.source.getFreeDragPosition().x,
      y: event.source.getFreeDragPosition().y,
    });
  }
  dragEndedCurve1(event: CdkDragEnd, group: GeneratedSvgForm.CommandGroup) {
    group.patchValue({
      x1: event.source.getFreeDragPosition().x,
      y1: event.source.getFreeDragPosition().y,
    });
  }
  dragEndedCurve2(event: CdkDragEnd, group: GeneratedSvgForm.CommandGroup) {
    group.patchValue({
      x2: event.source.getFreeDragPosition().x,
      y2: event.source.getFreeDragPosition().y,
    });
  }
  dragEndedTag(event: CdkDragEnd, tag: GeneratedSVG.ITag) {
    tag.x = event.source.getFreeDragPosition().x;
    tag.y = event.source.getFreeDragPosition().y;
  }
}

interface SVGEditor {
  import: () => void;
  export: () => void;
  select: (i: number) => void;
  isSelected(i: number): boolean;
  pathClick: () => void;
}
