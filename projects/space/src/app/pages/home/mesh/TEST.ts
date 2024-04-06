import {
  Component,
  Optional,
  SkipSelf,
  effect,
  forwardRef,
  model,
} from '@angular/core';
import { FiberParent, provideFiberParent, xyz } from '@daxur-studios/engine';
import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  Object3D,
  SphereGeometry,
} from 'three';

@Component({
  standalone: true,
  selector: 'fiber',
  template: `<ng-content></ng-content>`,
  providers: [provideFiberParent(FiberComponent)],
})
export class FiberComponent implements FiberParent {
  readonly position = model<xyz>([0, 0, 0]);

  static instance = 0;
  name = '';

  object3D = new Mesh();

  constructor(@SkipSelf() @Optional() public parent?: FiberParent) {
    FiberComponent.instance++;
    this.name = `Fiber ${FiberComponent.instance}`;

    this.object3D.geometry = new BoxGeometry(1, 2, 3);
    this.object3D.material = new MeshNormalMaterial();

    effect(() => {
      this.object3D.position.set(...this.position());
    });

    if (parent) {
      parent.object3D.add(this.object3D);
    }
  }
}

@Component({
  standalone: true,
  selector: 'fiber-sphere',
  template: `<ng-content></ng-content>`,
  providers: [provideFiberParent(FiberSphereComponent)],
})
export class FiberSphereComponent extends FiberComponent {
  constructor(@SkipSelf() @Optional() public override parent?: FiberParent) {
    super(parent);
    this.object3D.geometry = new SphereGeometry(1, 20, 20);
  }
}
