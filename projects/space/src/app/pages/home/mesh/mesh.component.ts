import {
  AfterContentInit,
  Component,
  OnDestroy,
  SkipSelf,
  effect,
  model,
  signal,
} from '@angular/core';
import { Object3DService } from '@daxur-studios/engine';
import { BufferGeometry, Group, Material, Mesh } from 'three';
import { Object3DComponent } from './object-3d.component';

@Component({
  standalone: true,
  selector: 'mesh',
  template: `<ng-content></ng-content>`,
  providers: [Object3DService],
})
export class MeshComponent extends Object3DComponent implements OnDestroy {
  readonly geometry = model<BufferGeometry>();
  readonly material = model<Material>();

  override object3D = signal(new Mesh());
  get mesh() {
    return this.object3D;
  }

  constructor() {
    super();

    effect(() => {
      const geometry = this.geometry();
      const mesh = this.mesh();
      if (geometry) {
        mesh.geometry = geometry;
      }
    });

    effect(() => {
      const material = this.material();
      const mesh = this.mesh();
      if (material) {
        mesh.material = material;
      }
    });
  }

  ngOnDestroy(): void {}
}
