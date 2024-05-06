import {
  Component,
  Optional,
  SkipSelf,
  effect,
  input,
  signal,
} from '@angular/core';

import { Mesh, SphereGeometry } from 'three';
import { MeshComponent } from './mesh.component';
import { provideObject3DComponent } from './object-3d.component';
import { SphereGeometryComponent } from './geometry.component';

type SphereGeometryParameters =
  (typeof SphereGeometry)['prototype']['parameters'];

@Component({
  selector: 'sphere',
  template: `
    <sphere-geometry [params]="params()"></sphere-geometry>
    <ng-content></ng-content>

    <mesh> </mesh>
  `,

  standalone: true,
  imports: [MeshComponent, SphereGeometryComponent],
  providers: [provideObject3DComponent(SphereComponent)],
})
export class SphereComponent extends MeshComponent {
  readonly params = input<Partial<SphereGeometryParameters>>({
    radius: 1,
    widthSegments: 12,
    heightSegments: 12,
  });

  override readonly object3D = signal(new Mesh<SphereGeometry>());

  constructor() {
    super();
  }
}
