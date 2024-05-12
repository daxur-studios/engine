import {
  Component,
  OnDestroy,
  Optional,
  Provider,
  SkipSelf,
  WritableSignal,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  model,
  signal,
  viewChildren,
} from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import {
  BoxGeometry,
  BufferGeometry,
  Material,
  Mesh,
  MeshNormalMaterial,
  Object3D,
  SphereGeometry,
} from 'three';
import { MeshComponent } from './mesh.component';
import { xyz } from '../../core';
import { EngineService } from '../../services';

/**
 * This allows to get the parent component of the current component.
 * This is required when nesting Object3DComponent extended components in the template.
 */
export function provideObject3DComponent<T>(component: T): Provider {
  return {
    provide: Object3DComponent,
    useExisting: forwardRef(() => component),
  };
}

@Component({
  standalone: true,
  selector: 'object-3d',
  template: `<ng-content></ng-content>`,
  providers: [],
})
export abstract class Object3DComponent implements OnDestroy {
  static InstanceCounts = new Map<string, number>();

  readonly _viewChildren = viewChildren(Object3DComponent);
  readonly _contentChildren = contentChildren(Object3DComponent);

  readonly children = computed(() => [
    ...this._viewChildren(),
    ...this._contentChildren(),
  ]);

  readonly position = model<xyz>([0, 0, 0]);
  readonly scale = model<xyz | number>(1);
  readonly rotation = model<xyz>([0, 0, 0]);

  name = '';
  public emoji = '';

  readonly engineService = inject(EngineService);
  readonly parent = inject(Object3DComponent, {
    skipSelf: true,
    optional: true,
  });

  abstract object3D: WritableSignal<Object3D>;

  readonly destroy$ = new Subject<void>();
  constructor() {
    const shortName = this.constructor.name
      .replace('Component', '')
      .replaceAll('_', '');
    //#region Static Instance Counts
    Object3DComponent.InstanceCounts.set(
      'Object3DComponent',
      (Object3DComponent.InstanceCounts.get('Object3DComponent') || 0) + 1
    );
    Object3DComponent.InstanceCounts.set(
      shortName,
      (Object3DComponent.InstanceCounts.get(shortName) || 0) + 1
    );

    this.name = `${shortName} ${Object3DComponent.InstanceCounts.get(
      shortName
    )}`;
    //#endregion

    effect(() => {
      const children = this.children();

      if (children.length > 1)
        console.error('CONTENT CHILDREN' + this.name, children);

      children.forEach((child) => {
        this.object3D().add(child.object3D());
      });
    });

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

    // effect(() => {
    //   const parentComponent = this.parentService.component();
    //   const object3D = this.object3D();

    //   if (parentComponent) {
    //     this.engineService.consoleLogGroup(
    //       `Added ${this.name} to parent ${parentComponent.name}`,
    //       'debug'
    //     );
    //     const parentObject3D = parentComponent.object3D();
    //     if (parentObject3D === object3D) {
    //       console.error(
    //         'You might need to add Object3DService to the provider list of the component in ' +
    //           this.name
    //       );
    //     }
    //     parentComponent.object3D().add(this.object3D());
    //   } else {
    //     console.error('No parent', this);
    //   }
    // });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
