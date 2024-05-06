import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  input,
} from '@angular/core';
import { EngineComponent } from '../engine/engine.component';

import { ILevelEditorReady } from '../../models/level-editor.model';
import { LevelEditorToolbarComponent } from '../level-editor-toolbar/level-editor-toolbar.component';
import { SceneTreeComponent } from '../scene-tree/scene-tree.component';

import { IEngineOptions } from '../../models/engine.model';
import { LevelEditorService } from '../../services/level-editor.service';

@Component({
  selector: 'daxur-level-editor',
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.scss'],
  standalone: true,
  host: {
    class: 'flex-page',
  },
  imports: [EngineComponent, LevelEditorToolbarComponent, SceneTreeComponent],
})
export class LevelEditorComponent implements OnInit {
  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;
  @ViewChild(LevelEditorToolbarComponent, { static: true })
  toolbar?: LevelEditorToolbarComponent;

  @Output() ready: EventEmitter<ILevelEditorReady> = new EventEmitter();

  constructor(readonly levelEditorService: LevelEditorService) {}

  ngOnInit(): void {}

  public onEngineReady(engine: EngineComponent) {
    this.ready.emit({
      editor: this,
      engine: engine,
    });
  }
}
