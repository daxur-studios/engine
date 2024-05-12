import {
  Component,
  InputSignal,
  OnDestroy,
  Provider,
  WritableSignal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  Material,
  MaterialParameters,
  MeshNormalMaterial,
  MeshNormalMaterialParameters,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  RawShaderMaterial,
  ShaderMaterial,
  ShaderMaterialParameters,
} from 'three';

import { MeshComponent } from './mesh.component';
import { Object3DComponent } from './object-3d.component';
import { EngineService } from '../../services';

export function provideMaterialComponent<T extends typeof MaterialComponent>(
  component: T
): Provider {
  return {
    provide: MaterialComponent,
    useExisting: component,
  };
}

@Component({
  selector: 'material',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export abstract class MaterialComponent implements OnDestroy {
  abstract params: InputSignal<MaterialParameters>;
  abstract material: WritableSignal<Material>;

  readonly engineService = inject(EngineService);
  readonly parent = inject(Object3DComponent, {
    skipSelf: true,
  });

  constructor() {
    effect(
      () => {
        this.updateFromParameters(this.params(), this.material());
      },
      { allowSignalWrites: true }
    );
  }

  updateFromParameters(parameters: MaterialParameters, material: Material) {
    material.setValues(parameters);
    material.needsUpdate = true;

    this.material.set(material);
  }

  ngOnDestroy(): void {
    this.material()?.dispose();
  }
}

@Component({
  selector: 'mesh-standard-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [provideMaterialComponent(MeshStandardMaterialComponent)],
})
export class MeshStandardMaterialComponent extends MaterialComponent {
  override readonly params = input<MeshStandardMaterialParameters>({});

  override readonly material = signal(new MeshStandardMaterial());

  constructor() {
    super();
  }
}

@Component({
  selector: 'mesh-normal-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [provideMaterialComponent(MeshNormalMaterialComponent)],
})
export class MeshNormalMaterialComponent extends MaterialComponent {
  readonly params = input<MeshNormalMaterialParameters>({});
  public override material = signal(new MeshNormalMaterial());

  constructor() {
    super();
  }
}

@Component({
  selector: 'shader-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [provideMaterialComponent(ShaderMaterialComponent)],
})
export class ShaderMaterialComponent extends MaterialComponent {
  readonly params = input<ShaderMaterialParameters>({});

  public override material = signal(new ShaderMaterial());

  constructor() {
    super();
  }
}

@Component({
  selector: 'raw-shader-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [provideMaterialComponent(RawShaderMaterialComponent)],
})
export class RawShaderMaterialComponent extends MaterialComponent {
  readonly params = input<ShaderMaterialParameters>({});

  public override material = signal(new RawShaderMaterial());

  constructor() {
    super();
  }
}
