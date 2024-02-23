import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  GraphComponent,
  GraphController,
  HtmlMapComponent,
} from '@daxur-studios/graph';
import { SvgUiEditorSidebarComponent } from './svg-ui-editor-sidebar/svg-ui-editor-sidebar.component';
import { SvgEditorService } from './svg-editor.service';
import { GeneratedSvgComponent } from '../generated-svg/generated-svg.component';
import { GeneratedSvgForm } from './svg-editor.form.model';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'lib-svg-ui-editor',
  standalone: true,
  imports: [
    CommonModule,
    HtmlMapComponent,
    SvgUiEditorSidebarComponent,
    GeneratedSvgComponent,
    DragDropModule,
  ],
  templateUrl: './svg-ui-editor.component.html',
  styleUrl: './svg-ui-editor.component.scss',
})
export class SvgUiEditorComponent implements SVGEditor {
  readonly inputs = this.svgEditorService.inputs;

  readonly GeneratedSvgForm = GeneratedSvgForm;
  readonly svgInputFormArray = this.svgEditorService.svgInputFormArray;

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
      position: {
        x: event.source.getFreeDragPosition().x,
        y: event.source.getFreeDragPosition().y,
      },
    });
  }
  dragEndedCurve1(event: CdkDragEnd, group: GeneratedSvgForm.CommandGroup) {
    group.patchValue({
      position: {
        x1: event.source.getFreeDragPosition().x,
        y1: event.source.getFreeDragPosition().y,
      },
    });
  }
  dragEndedCurve2(event: CdkDragEnd, group: GeneratedSvgForm.CommandGroup) {
    group.patchValue({
      position: {
        x2: event.source.getFreeDragPosition().x,
        y2: event.source.getFreeDragPosition().y,
      },
    });
  }
}

interface SVGEditor {
  import: () => void;
  export: () => void;
  select: (i: number) => void;
  isSelected(i: number): boolean;
  pathClick: () => void;
}
