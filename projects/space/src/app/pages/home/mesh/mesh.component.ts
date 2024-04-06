import {
  AfterContentInit,
  Component,
  Injector,
  Optional,
  SkipSelf,
  effect,
  input,
  model,
  signal,
} from '@angular/core';
import {
  Object3DParent,
  provideObject3DParent,
  xyz,
} from '@daxur-studios/engine';
import {
  BufferGeometry,
  GridHelper,
  Group,
  Material,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
  Object3DEventMap,
  SphereGeometry,
} from 'three';
import { MeshComponent, Object3DComponent } from './object-3d.component';

// @Component({
//   selector: 'object-3d',
//   template: `<ng-content></ng-content> `,
//   styles: ``,
//   standalone: true,
//   imports: [],
// })
// export abstract class Object3DComponent implements IObject3DComponent {
//   readonly parent = input.required<IObject3DComponent>();
//   readonly position = input<xyz>([0, 0, 0]);
//   readonly scale = input<xyz | number>([0, 0, 0]);
//   readonly rotation = input<xyz>([0, 0, 0]);

//   abstract object3D: Object3D;

//   constructor(readonly injector: Injector) {
//     //#region Add to Parent
//     effect(() => {
//       const object3D = this.getComponentObject3D();

//       this.parent().add(object3D);
//     });
//     //#endregion

//     //#region Keep Position in Sync
//     effect(() => {
//       this.getComponentObject3D().position.set(...this.position());
//     });
//     //#endregion

//     //#region Keep Rotation in Sync
//     effect(() => {
//       this.getComponentObject3D().rotation.set(...this.rotation());
//     });
//     //#endregion

//     //#region Keep Scale in Sync
//     effect(() => {
//       const scale = this.scale();
//       if (typeof scale === 'number') {
//         this.getComponentObject3D().scale.set(scale, scale, scale);
//       } else {
//         this.getComponentObject3D().scale.set(...scale);
//       }
//     });
//     //#endregion
//   }
//   //#region Object3DComponent

//   getComponentObject3D() {
//     return this.object3D;
//   }
//   add(object: Object3D<Object3DEventMap>): void {
//     this.getComponentObject3D().add(object);
//   }
//   remove(object: Object3D<Object3DEventMap>): void {
//     this.getComponentObject3D().remove(object);
//   }
//   ngOnDestroy(): void {
//     this.parent().remove(this.getComponentObject3D());
//   }
//   //#endregion
// }

// @Component({
//   selector: 'meshv1',
//   template: `<ng-content></ng-content> `,
//   styles: ``,
//   standalone: true,
//   imports: [],
// })
// export class MeshV1Component extends Object3DComponent {
//   readonly geometry = model<BufferGeometry>();
//   readonly material = model<Material>();

//   override readonly object3D = new Mesh();
//   get mesh() {
//     return this.object3D;
//   }

//   constructor(override readonly injector: Injector) {
//     super(injector);

//     effect(() => {
//       const geometry = this.geometry();
//       if (geometry) {
//         this.mesh.geometry = geometry;
//       }
//     });

//     effect(() => {
//       const material = this.material();
//       if (material) {
//         this.mesh.material = material;
//       }
//     });
//   }
// }

@Component({
  selector: 'group',
  template: `<ng-content></ng-content> `,
  styles: ``,
  standalone: true,
  imports: [],
})
export class GroupComponent
  extends Object3DComponent
  implements AfterContentInit
{
  override readonly object3D = signal(new Group());

  constructor(@SkipSelf() public override parent: Object3DParent) {
    super(parent);
  }

  ngAfterContentInit(): void {}
}

@Component({
  selector: 'celestial-body',
  template: ` <ng-content></ng-content> `,
  styles: ``,
  standalone: true,
  imports: [GroupComponent, MeshComponent],
  providers: [provideObject3DParent(CelestialBodyComponent)],
})
export class CelestialBodyComponent extends MeshComponent {
  constructor(@SkipSelf() public override parent: Object3DParent) {
    super(parent);
  }
}
