import {
  Component,
  effect,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MeshComponent } from '../mesh.component';

import {
  Object3DComponent,
  provideObject3DComponent,
} from '../object-3d.component';
import {
  BoxGeometryComponent,
  BufferGeometryComponent,
  PlaneGeometryComponent,
} from '../geometry.component';
import {
  MeshNormalMaterialComponent,
  MeshStandardMaterialComponent,
  ShaderMaterialComponent,
} from '../material.component';
import { Float32BufferAttribute, Vector3 } from 'three';

interface ILandscapeParams {
  width: number;
  height: number;
  segments: number;
  wireFrame?: boolean;
}

@Component({
  selector: 'landscape',
  standalone: true,
  imports: [
    PlaneGeometryComponent,
    BufferGeometryComponent,
    MeshStandardMaterialComponent,
    MeshNormalMaterialComponent,
    ShaderMaterialComponent,
  ],
  providers: [provideObject3DComponent(LandscapeComponent)],
  template: ` s
    <mesh-standard-material
      [params]="{
        color: '#00ff00',
        side: 2,
        
      }"
    />
    <!-- <mesh-normal-material /> -->

    <buffer-geometry />
    <ng-content></ng-content>`,
})
export class LandscapeComponent extends MeshComponent {
  override emoji = '🏔️';

  readonly params = input.required<ILandscapeParams>();

  readonly bufferGeometryComponent = viewChild.required(
    BufferGeometryComponent
  );

  constructor() {
    super();

    effect(() => {
      this.mesh().receiveShadow = true;
    });

    effect(() => {
      const component = this.bufferGeometryComponent();
      const geometry = component.geometry();

      const { segments, width, height } = this.params();

      // Calculate the number of vertices
      const count = (segments + 1) * (segments + 1);

      // Arrays to store vertex positions
      const positions = [];
      const indices = [];

      // Helper function to calculate elevation (optional)
      const calculateElevation = (x: number, z: number) => {
        return Math.sin(x * 0.1) * Math.cos(z * 0.05) * 5;
      };

      // Create vertices
      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const x = (i / segments) * width - width / 2;
          const z = (j / segments) * height - height / 2;
          const y = calculateElevation(x, z); // Y position based on some function
          positions.push(x, y, z);
        }
      }

      // Create indices for the faces
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
          const a = i * (segments + 1) + j;
          const b = i * (segments + 1) + (j + 1);
          const c = (i + 1) * (segments + 1) + j;
          const d = (i + 1) * (segments + 1) + (j + 1);

          // Two triangles per square
          indices.push(a, b, d);
          indices.push(d, c, a);
        }
      }

      // Assign positions and indices to the geometry
      geometry.setAttribute(
        'position',
        new Float32BufferAttribute(positions, 3)
      );
      geometry.setIndex(indices);

      geometry.computeVertexNormals();
    });
  }
}
