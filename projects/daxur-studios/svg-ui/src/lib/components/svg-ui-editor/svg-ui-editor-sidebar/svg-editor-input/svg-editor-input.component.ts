import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeneratedSvgForm } from '../../svg-editor.form.model';
import { GeneratedSVG } from '../../../../models';
import { CommandInputComponent } from './command-input/command-input.component';
import { SvgEditorService } from '../../svg-editor.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'lib-svg-editor-input',
  standalone: true,
  imports: [
    CommandInputComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './svg-editor-input.component.html',
  styleUrl: './svg-editor-input.component.scss',
})
export class SvgEditorInputComponent {
  @Input() group!: GeneratedSvgForm.SvgInputGroup;

  readonly GeneratedSvgForm = GeneratedSvgForm;
  readonly GeneratedSVG = GeneratedSVG;

  get uniqueTags() {
    return this.svgEditorService.generatedSvgFormGroup.controls.uniqueTags;
  }

  constructor(private svgEditorService: SvgEditorService) {}

  removePoint(group: GeneratedSvgForm.SvgInputGroup, i: number) {
    if (GeneratedSvgForm.isSvgPathControls(group.controls))
      this.svgEditorService.removePoint(group.controls.commands, i);
  }
}
