import { Component, effect, inject, signal } from '@angular/core';
import { Group, PerspectiveCamera } from 'three';
import {
  Object3DComponent,
  provideObject3DComponent,
} from './object-3d.component';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EngineService } from '../../services';

import { takeUntil } from 'rxjs';

@Component({
  selector: 'orbit-controls',
  template: `<ng-content></ng-content> `,

  standalone: true,
  imports: [],
  providers: [provideObject3DComponent(OrbitControlsComponent)],
})
export class OrbitControlsComponent extends Object3DComponent {
  override readonly object3D = signal(new Group());

  readonly orbitControls = signal<OrbitControls | undefined>(undefined);

  constructor() {
    super();

    effect(() => {
      this.engineService.orbitControls = this.orbitControls();
    });

    setTimeout(() => {
      const engine = this.engineService;

      const orbit = new OrbitControls(
        engine!.camera,
        engine!.renderer!.domElement
      );

      this.orbitControls.set(orbit);
      orbit.enableDamping = true;
      //   this.controls.zoomSpeed = 100;
      const camera = orbit.object as PerspectiveCamera;
      camera.far = Number.MAX_SAFE_INTEGER;
      camera.updateProjectionMatrix();

      orbit.addEventListener('change', () => {
        const distance = orbit.object.position.distanceTo(orbit.target);

        // Base zoom speed
        const baseZoomSpeed = 1;

        // Calculate dynamic zoom speed based on distance
        // Using a logarithmic scale to ensure it increases at a decreasing rate
        // Adding 1 to avoid logarithm of zero and ensure a minimum speed multiplier
        const zoomSpeedMultiplier = Math.log(distance + 1);

        // Adjust zoom speed dynamically
        orbit.zoomSpeed = baseZoomSpeed * zoomSpeedMultiplier;

        // // Increase how far the camera sees before it clips objects.
        // camera.far = distance
        // camera.updateProjectionMatrix();
      });

      this.engineService.tick$
        .pipe(takeUntil(this.engineService.onDestroy$))
        .subscribe((delta) => {
          this.orbitControls()?.update();
        });

      this.engineService?.camera.position.set(0, 2, 5);
    }, 111);
  }
}
