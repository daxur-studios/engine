import {
  Component,
  Optional,
  SkipSelf,
  WritableSignal,
  effect,
  forwardRef,
  model,
  signal,
} from '@angular/core';
import {
  Object3DParent,
  provideObject3DParent,
  xyz,
} from '@daxur-studios/engine';
import { BehaviorSubject } from 'rxjs';
import {
  BoxGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshNormalMaterial,
  Object3D,
  SphereGeometry,
} from 'three';

@Component({
  standalone: true,
  selector: 'object-3d',
  template: `<ng-content></ng-content>`,
  providers: [provideObject3DParent(Object3DComponent)],
})
export abstract class Object3DComponent implements Object3DParent {
  static InstanceCounts = new Map<string, number>();

  readonly position = model<xyz>([0, 0, 0]);
  readonly scale = model<xyz | number>(1);
  readonly rotation = model<xyz>([0, 0, 0]);

  name = '';

  abstract object3D: WritableSignal<Object3D>;

  constructor(@SkipSelf() public parent: Object3DParent) {
    //#region Static Instance Counts
    Object3DComponent.InstanceCounts.set(
      'Object3DComponent',
      (Object3DComponent.InstanceCounts.get('Object3DComponent') || 0) + 1
    );
    Object3DComponent.InstanceCounts.set(
      this.constructor.name,
      (Object3DComponent.InstanceCounts.get(this.constructor.name) || 0) + 1
    );

    this.name = `${
      this.constructor.name
    }Component ${Object3DComponent.InstanceCounts.get(this.constructor.name)}`;
    //#endregion

    effect(() => {
      this.object3D().position.set(...this.position());
    });
    effect(() => {
      const scale = this.scale();
      if (typeof scale === 'number') {
        this.object3D().scale.set(scale, scale, scale);
      } else {
        this.object3D().scale.set(...scale);
      }
    });
    effect(() => {
      this.object3D().rotation.set(...this.rotation());
    });

    effect(() => {
      if (this.parent) {
        this.parent.object3D().add(this.object3D());
        console.warn(`added ${this.name} to parent ${this.parent.name}`);
      } else {
        console.error('No parent', this);
      }
    });
  }
}

@Component({
  standalone: true,
  selector: 'mesh',
  template: `<ng-content></ng-content>`,
  providers: [provideObject3DParent(MeshComponent)],
})
export class MeshComponent extends Object3DComponent {
  readonly geometry = model<BufferGeometry>();
  readonly material = model<Material>();

  override object3D = signal(new Mesh());
  get mesh() {
    return this.object3D;
  }

  constructor(@SkipSelf() public override parent: Object3DParent) {
    super(parent);

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
}

@Component({
  standalone: true,
  selector: 'fiber-sphere',
  template: `<ng-content></ng-content>`,
  providers: [provideObject3DParent(FiberSphereComponent)],
})
export class FiberSphereComponent extends MeshComponent {
  constructor(@SkipSelf() public override parent: Object3DParent) {
    super(parent);

    this.geometry.set(new SphereGeometry(1, 20, 20));
    this.material.set(new MeshNormalMaterial());
  }
}
