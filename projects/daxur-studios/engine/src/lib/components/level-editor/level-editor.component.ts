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
import { EngineService } from '../../services';

@Component({
  selector: 'daxur-level-editor',
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.scss'],
  standalone: true,
  host: {
    class: 'flex-page',
  },
  imports: [EngineComponent, LevelEditorToolbarComponent, SceneTreeComponent],
  providers: [EngineService, LevelEditorService],
})
export class LevelEditorComponent implements OnInit {
  @Input({ required: true }) options?: IEngineOptions;
  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;
  @ViewChild(LevelEditorToolbarComponent, { static: true })
  toolbar?: LevelEditorToolbarComponent;

  @Output() ready: EventEmitter<ILevelEditorReady> = new EventEmitter();

  constructor(
    readonly levelEditorService: LevelEditorService,
    readonly engineService: EngineService
  ) {}

  ngOnInit(): void {}

  public onEngineReady(engine: EngineComponent) {
    this.ready.emit({
      editor: this,
      engine: engine,
    });
  }
}
