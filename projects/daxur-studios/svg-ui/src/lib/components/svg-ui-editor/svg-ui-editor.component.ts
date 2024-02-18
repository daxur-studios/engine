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

@Component({
  selector: 'lib-svg-ui-editor',
  standalone: true,
  imports: [
    CommonModule,
    HtmlMapComponent,
    SvgUiEditorSidebarComponent,
    GeneratedSvgComponent,
  ],
  templateUrl: './svg-ui-editor.component.html',
  styleUrl: './svg-ui-editor.component.scss',
})
export class SvgUiEditorComponent implements SVGEditor {
  readonly paths = this.svgEditorService.paths;

  readonly svgPathFormArray = this.svgEditorService.svgPathFormArray;
  // readonly commandsFormArray = this.svgEditorService.commandsFormArray;
  // readonly dynamicSvgGroup = this.svgEditorService.dynamicSvgGroup;

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
}

interface SVGEditor {
  import: () => void;
  export: () => void;
  select: (i: number) => void;
  isSelected(i: number): boolean;
  pathClick: () => void;
}
