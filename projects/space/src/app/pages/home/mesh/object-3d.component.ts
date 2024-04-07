import {
  Component,
  OnDestroy,
  Optional,
  SkipSelf,
  WritableSignal,
  effect,
  forwardRef,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  EngineService,
  Object3DParent,
  Object3DService,
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
  providers: [Object3DService],
})
export abstract class Object3DComponent implements Object3DParent {
  static InstanceCounts = new Map<string, number>();

  readonly position = model<xyz>([0, 0, 0]);
  readonly scale = model<xyz | number>(1);
  readonly rotation = model<xyz>([0, 0, 0]);

  name = '';

  readonly engineService: EngineService = inject(EngineService, {
    skipSelf: true,
  });
  //readonly object3DService: Object3DService = inject(Object3DService);

  abstract object3D: WritableSignal<Object3D>;

  constructor(
    public readonly object3DService: Object3DService,
    @SkipSelf() public readonly parentService: Object3DService
  ) {
    this.object3DService.setComponent(this);
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
    } ${Object3DComponent.InstanceCounts.get(this.constructor.name)}`;
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
      const parentComponent = this.parentService.component();
      const object3D = this.object3D();

      if (parentComponent) {
        this.engineService.consoleLogGroup(
          `Added ${this.name} to parent ${parentComponent.name}`,
          'debug'
        );
        const parentObject3D = parentComponent.object3D();
        if (parentObject3D === object3D) {
          console.error(
            'You might need to add Object3DService to the provider list of the component in ' +
              this.name
          );
        }
        parentComponent.object3D().add(this.object3D());
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
  providers: [Object3DService],
})
export class MeshComponent extends Object3DComponent implements OnDestroy {
  readonly geometry = model<BufferGeometry>();
  readonly material = model<Material>();

  override object3D = signal(new Mesh());
  get mesh() {
    return this.object3D;
  }

  constructor(
    public override readonly object3DService: Object3DService,
    @SkipSelf()
    public override readonly parentService: Object3DService
  ) {
    super(object3DService, parentService);

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

@Component({
  standalone: true,
  selector: 'fiber-sphere',
  template: `<ng-content></ng-content>`,
  providers: [Object3DService],
})
export class FiberSphereComponent extends MeshComponent {
  constructor(
    public override readonly object3DService: Object3DService,
    @SkipSelf()
    public override readonly parentService: Object3DService
  ) {
    super(object3DService, parentService);

    this.geometry.set(new SphereGeometry(1, 20, 20));
    this.material.set(new MeshNormalMaterial());
  }
}
