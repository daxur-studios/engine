import { Component } from '@angular/core';
import {
  DefaultPawnComponent,
  EngineService,
  LevelEditorComponent,
  LevelEditorService,
  SkyDomeComponent,
} from '@daxur-studios/engine';

@Component({
  selector: 'app-level-editor-demo',
  standalone: true,
  imports: [LevelEditorComponent, SkyDomeComponent, DefaultPawnComponent],
  providers: [EngineService, LevelEditorService],
  templateUrl: './level-editor-demo.component.html',
  styleUrl: './level-editor-demo.component.scss',
})
export class LevelEditorDemoComponent {
  constructor(readonly engineService: EngineService) {}
}
