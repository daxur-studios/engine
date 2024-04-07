import {
  Component,
  Host,
  Inject,
  InputSignal,
  OnDestroy,
  Optional,
  SkipSelf,
  WritableSignal,
  effect,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  GameMesh,
  Object3DParent,
  Object3DService,
} from '@daxur-studios/engine';
import {
  Material,
  MaterialParameters,
  Mesh,
  MeshNormalMaterial,
  MeshNormalMaterialParameters,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
} from 'three';
import { MeshComponent } from './object-3d.component';

@Component({
  selector: 'material',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export abstract class MaterialComponent implements OnDestroy {
  abstract params: InputSignal<MaterialParameters>;
  abstract material: WritableSignal<Material>;

  constructor(readonly object3DService: Object3DService) {
    effect(
      () => {
        const meshComponent = object3DService.component() as MeshComponent;

        this.updateFromParameters(
          this.params(),
          this.material(),
          meshComponent
        );
      },
      { allowSignalWrites: true }
    );
  }

  updateFromParameters(
    parameters: MaterialParameters,
    material: Material,
    meshComponent: MeshComponent
  ) {
    material.setValues(parameters);
    material.needsUpdate = true;

    if (meshComponent) {
      meshComponent.material.set(material);
    }
  }

  ngOnDestroy(): void {
    this.material()?.dispose();
  }
}

@Component({
  selector: 'mesh-standard-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class MeshStandardMaterialComponent extends MaterialComponent {
  override readonly params = input<MeshStandardMaterialParameters>({});

  override readonly material = signal(new MeshStandardMaterial());

  constructor(public override readonly object3DService: Object3DService) {
    super(object3DService);
  }
}

@Component({
  selector: 'mesh-normal-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class MeshNormalMaterialComponent extends MaterialComponent {
  readonly params = input<MeshNormalMaterialParameters>({});
  public override material = signal(new MeshNormalMaterial());

  constructor(public override object3DService: Object3DService) {
    super(object3DService);
  }
}
