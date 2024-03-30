import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  DefaultPawn,
  EngineComponent,
  EngineController,
  GameMesh,
} from '@daxur-studios/engine';
import { takeUntil } from 'rxjs';
import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  SphereGeometry,
  Vector3,
} from 'three';

@Component({
  selector: 'animated-cube',
  standalone: true,
  imports: [],
  template: '',
})
export class AnimatedCubeComponent implements OnInit {
  @Input({ required: true }) controller!: EngineController;

  constructor() {}

  ngOnInit(): void {
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
    mesh.position.set(0, 0, -4);

    this.controller.scene.add(mesh);

    this.controller.tick$
      .pipe(takeUntil(this.controller.onDestroy$))
      .subscribe((delta) => {
        mesh.rotation.x -= 0.01;
        mesh.rotation.y += 0.01;
      });
  }
}

@Component({
  selector: 'random-moving-ball',
  standalone: true,
  imports: [],
  template: '',
})
export class RandomMovingBallComponent implements OnInit {
  @Input({ required: true }) controller!: EngineController;

  targetLocation: Vector3 = new Vector3(0, 0, 0);

  constructor() {}

  ngOnInit(): void {
    const mesh = new Mesh(
      new SphereGeometry(0.5, 6, 6),
      new MeshNormalMaterial()
    );
    mesh.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );
    this.targetLocation.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    this.controller.scene.add(mesh);

    this.controller.tick$
      .pipe(takeUntil(this.controller.onDestroy$))
      .subscribe((delta) => {
        let factor = 0.01;
        // Move the ball towards the target location
        mesh.position.lerp(this.targetLocation, factor);
        // If the ball is close enough to the target location, set a new target location
        if (mesh.position.distanceTo(this.targetLocation) < 0.1) {
          this.targetLocation.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
          );
        }
      });
  }
}

@Component({
  selector: 'app-engine-demo-page',
  standalone: true,
  imports: [EngineComponent, AnimatedCubeComponent, RandomMovingBallComponent],
  templateUrl: './engine-demo-page.component.html',
  styleUrl: './engine-demo-page.component.scss',
})
export class EngineDemoPageComponent {
  readonly controller = new EngineController({ showFPS: true });

  ngOnInit() {
    const controller = this.controller;
    if (!controller) return;

    const axes = new AxesHelper(5);
    axes.position.set(-0.5, -0.5, -0.5);
    axes.rotation.set(0, 1, 0);
    controller.scene.add(axes);

    const pawn = new DefaultPawn();
    controller.spawnActor(pawn);
    controller.switchCamera(pawn.camera);
  }
}
