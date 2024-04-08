import {
  Component,
  Optional,
  SkipSelf,
  effect,
  input,
  signal,
} from '@angular/core';
import { Object3DParent, Object3DService } from '@daxur-studios/engine';
import { Mesh, SphereGeometry } from 'three';
import { MeshComponent } from './mesh.component';

type SphereGeometryParameters =
  (typeof SphereGeometry)['prototype']['parameters'];

@Component({
  selector: 'sphere',
  template: `<ng-content></ng-content> `,

  standalone: true,
  imports: [],
  providers: [Object3DService],
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

    effect(
      () => {
        const params = this.params();
        this.mesh().geometry.dispose();
        this.geometry.set(
          new SphereGeometry(
            params.radius,
            params.widthSegments,
            params.heightSegments,
            params.phiStart,
            params.phiLength,
            params.thetaStart,
            params.thetaLength
          )
        );
      },
      { allowSignalWrites: true }
    );
  }
}
