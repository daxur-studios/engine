import { Component, Input } from '@angular/core';
import { EngineComponent } from '../engine/engine.component';
import { EngineConfig } from '../../models';
import { LevelEditorToolbarComponent } from '../level-editor-toolbar/level-editor-toolbar.component';

@Component({
  selector: 'daxur-level-editor',
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.css'],
  standalone: true,
  host: {
    class: 'flex-page',
  },
  imports: [EngineComponent, LevelEditorToolbarComponent],
})
export class LevelEditorComponent {
  @Input({ required: true }) config!: EngineConfig;
}
