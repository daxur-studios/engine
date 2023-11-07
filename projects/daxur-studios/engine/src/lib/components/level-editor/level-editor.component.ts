import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EngineComponent } from '../engine/engine.component';

import { LevelEditorToolbarComponent } from '../level-editor-toolbar/level-editor-toolbar.component';
import { ILevelEditorReady } from '../../models/level-editor.model';
import { SceneTreeComponent } from '../scene-tree/scene-tree.component';

import { LevelEditorService } from '../../services/level-editor.service';
import { IEngineOptions } from '../../models/engine.model';

@Component({
  selector: 'daxur-level-editor',
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.css'],
  standalone: true,
  host: {
    class: 'flex-page',
  },
  imports: [EngineComponent, LevelEditorToolbarComponent, SceneTreeComponent],
  providers: [LevelEditorService],
})
export class LevelEditorComponent implements OnInit {
  @Input({ required: true }) options?: IEngineOptions;
  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;
  @ViewChild(LevelEditorToolbarComponent, { static: true })
  toolbar?: LevelEditorToolbarComponent;

  @Output() ready: EventEmitter<ILevelEditorReady> = new EventEmitter();

  constructor(public readonly levelEditorService: LevelEditorService) {}

  ngOnInit(): void {}

  public onEngineReady(engine: EngineComponent) {
    this.ready.emit({
      editor: this,
      engine: engine,
    });
  }
}
