import { Component } from '@angular/core';
import {
  DefaultPawnComponent,
  EngineService,
  LevelEditorComponent,
  LevelEditorService,
  SkyDomeComponent,
} from '@daxur-studios/engine';
import {
  AnimatedCubeComponent,
  RandomMovingBallComponent,
} from '../engine-demo-page/engine-demo-page.component';
import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-level-editor-demo',
  standalone: true,
  imports: [
    LevelEditorComponent,
    SkyDomeComponent,
    DefaultPawnComponent,
    AnimatedCubeComponent,
    RandomMovingBallComponent,
  ],
  providers: [EngineService, LevelEditorService],
  templateUrl: './level-editor-demo.component.html',
  styleUrl: './level-editor-demo.component.scss',
})
export class LevelEditorDemoComponent {
  constructor(
    readonly engineService: EngineService,
    readonly levelEditorService: LevelEditorService
  ) {
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
    mesh.position.set(0, 0, -4);

    engineService.scene.add(mesh);

    engineService.tick$
      .pipe(takeUntil(engineService.onDestroy$))
      .subscribe((delta) => {
        mesh.rotation.x -= 0.01;
        mesh.rotation.y += 0.01;
      });
  }
}
