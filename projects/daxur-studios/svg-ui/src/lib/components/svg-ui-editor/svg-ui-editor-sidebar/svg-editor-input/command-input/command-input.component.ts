import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeneratedSvgForm } from '../../../svg-editor.form.model';
import { GeneratedSVG, SvgEditorService } from '@daxur-studios/svg-ui';

@Component({
  selector: 'lib-command-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './command-input.component.html',
  styleUrl: './command-input.component.scss',
})
export class CommandInputComponent {
  @Input() group!: GeneratedSvgForm.CommandGroup;

  get uniqueTags() {
    return this.svgEditorService.generatedSvgFormGroup.controls.uniqueTags;
  }

  readonly GeneratedSvgForm = GeneratedSvgForm;
  readonly GeneratedSVG = GeneratedSVG;

  constructor(readonly svgEditorService: SvgEditorService) {}
}
