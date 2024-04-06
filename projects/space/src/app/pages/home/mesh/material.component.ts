import {
  Component,
  Host,
  Inject,
  Optional,
  SkipSelf,
  effect,
  forwardRef,
  input,
} from '@angular/core';
import {
  GameMesh,
  Object3DParent,
  provideObject3DParent,
} from '@daxur-studios/engine';
import {
  Material,
  Mesh,
  MeshNormalMaterial,
  MeshNormalMaterialParameters,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
} from 'three';
import { MeshComponent } from './object-3d.component';

// Marker class, used as an interface
export abstract class MaterialComponentParent {
  abstract material: Material;
}

// Helper method to provide the current component instance in the name of a `parentType`.
// The `parentType` defaults to `Parent` when omitting the second parameter.
export function provideMaterialComponentParent(
  component: any,
  parentType?: any
) {
  return {
    provide: parentType || MaterialComponentParent,
    useExisting: forwardRef(() => component),
  };
}

// interface MaterialComponent {
//   material: Material;
// }

@Component({
  selector: 'mesh-standard-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: ``,
  imports: [],
  providers: [provideObject3DParent(MeshStandardMaterialComponent)],
})
export class MeshStandardMaterialComponent implements MaterialComponentParent {
  readonly parameters = input<MeshStandardMaterialParameters>({});

  public material = new MeshStandardMaterial();

  readonly meshComponent: MeshComponent;

  constructor(@SkipSelf() public parent: Object3DParent) {
    this.meshComponent = parent as MeshComponent;

    effect(
      () => {
        this.updateFromParameters(this.parameters());
      },
      { allowSignalWrites: true }
    );
  }

  private updateFromParameters(parameters: MeshStandardMaterialParameters) {
    this.material.setValues(parameters);
    this.material.needsUpdate = true;

    if (this.meshComponent) {
      this.meshComponent.material.set(this.material);
    }
  }
}

@Component({
  selector: 'mesh-normal-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: ``,
  imports: [],
  providers: [provideObject3DParent(MeshNormalMaterialComponent)],
})
export class MeshNormalMaterialComponent implements MaterialComponentParent {
  readonly parameters = input<MeshNormalMaterialParameters>({});
  public material = new MeshNormalMaterial();

  readonly meshComponent: MeshComponent;

  constructor(@SkipSelf() public parent: Object3DParent) {
    this.meshComponent = parent as MeshComponent;
    effect(
      () => {
        this.updateParameters(this.parameters());
      },
      { allowSignalWrites: true }
    );
  }

  private updateParameters(parameters: MeshNormalMaterialParameters) {
    this.material.setValues(parameters);
    this.material.needsUpdate = true;

    if (this.meshComponent) {
      this.meshComponent.material.set(this.material);
    }
  }
}
