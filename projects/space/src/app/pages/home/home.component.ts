import { Component, effect } from '@angular/core';
import {
  EngineComponent,
  EngineController,
  GameMesh,
} from '@daxur-studios/engine';
import {
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
} from 'three';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EngineComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly controller = new EngineController({ showFPS: true });

  //viewChild

  constructor() {
    const scene = this.controller.scene;

    // Add GridHelper to the scene.
    const gridHelper = new GridHelper(10, 10);
    scene.add(gridHelper);

    // Add a light to the scene.
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);

    // Add a sphere to the scene.
    const geometry = new SphereGeometry(1, 32, 32);
    const material = new MeshPhongMaterial({ color: 0xff0000 });
    const sphere = new GameMesh(geometry, material);
    scene.add(sphere);

    effect(() => {
      // const engineComponent =
      // // Add OrbitControls to the scene.
      // this.controller.switchToOrbitControls();
    });
  }
}
