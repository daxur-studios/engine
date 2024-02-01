import { Component, ViewChild } from '@angular/core';
import {
  DefaultPawn,
  EngineComponent,
  EngineService,
  GameMesh,
} from '@daxur-studios/engine';
import { takeUntil } from 'rxjs';
import { AxesHelper, BoxGeometry, Mesh, MeshNormalMaterial } from 'three';

@Component({
  selector: 'animated-cube',
  standalone: true,
  imports: [],
  template: '',
})
export class AnimatedCubeComponent {
  constructor(readonly engineService: EngineService) {
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

@Component({
  selector: 'app-engine-demo-page',
  standalone: true,
  imports: [EngineComponent, AnimatedCubeComponent],
  templateUrl: './engine-demo-page.component.html',
  styleUrl: './engine-demo-page.component.scss',
})
export class EngineDemoPageComponent {
  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;
  ngOnInit() {
    const service = this.engine?.engineService;
    if (!service) return;

    const axes = new AxesHelper(5);
    axes.position.set(-0.5, -0.5, -0.5);
    axes.rotation.set(0, 1, 0);
    service.scene.add(axes);

    const pawn = new DefaultPawn();
    service.spawnActor(pawn);
    service.switchCamera(pawn.camera);
  }
}
