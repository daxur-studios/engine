import {
  AfterContentInit,
  Component,
  OnDestroy,
  SkipSelf,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  model,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { BufferGeometry, Group, Material, Mesh } from 'three';
import {
  Object3DComponent,
  provideObject3DComponent,
} from './object-3d.component';
import { MaterialComponent } from './material.component';
import { BufferGeometryComponent } from './geometry.component';

@Component({
  standalone: true,
  selector: 'mesh',
  template: `<ng-content></ng-content>`,
  providers: [provideObject3DComponent(MeshComponent)],
})
export class MeshComponent extends Object3DComponent implements OnDestroy {
  // readonly geometry = model<BufferGeometry>();
  // readonly material = model<Material>();

  override emoji = '🧇';
  override object3D = signal(new Mesh());
  get mesh() {
    return this.object3D;
  }

  //#region Materials
  readonly _contentChildMaterial = contentChild(MaterialComponent);
  readonly _viewChildMaterial = viewChild(MaterialComponent);
  readonly materialComponent = computed(
    () => this._contentChildMaterial() || this._viewChildMaterial()
  );
  //#endregion

  //#region Geometry
  readonly _contentChildGeometry = contentChild(BufferGeometryComponent);
  readonly _viewChildGeometry = viewChild(BufferGeometryComponent);
  readonly geometryComponent = computed(
    () => this._contentChildGeometry() || this._viewChildGeometry()
  );
  //#endregion

  constructor() {
    super();

    effect(() => {
      const materialComponent = this.materialComponent();
      const mesh = this.mesh();
      if (materialComponent) {
        console.warn('🪙 MATERIALS', materialComponent);
        mesh.material = materialComponent.material();
      }
    });

    effect(() => {
      const geometries = this.geometryComponent();
      const mesh = this.mesh();
      if (geometries) {
        console.warn('🌐 GEOMETRIES', geometries);
        mesh.geometry = geometries.geometry();
      }
    });

    // effect(() => {
    //   const geometry = this.geometry();
    //   const mesh = this.mesh();
    //   if (geometry) {
    //     mesh.geometry = geometry;
    //   }
    // });

    // effect(() => {
    //   const material = this.materialComponent();
    //   const mesh = this.mesh();
    //   if (material) {
    //     mesh.material = material.material();
    //   }
    // });
  }
}
