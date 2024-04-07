import {
  Component,
  Injector,
  Optional,
  SkipSelf,
  effect,
  input,
  signal,
} from '@angular/core';
import { AmbientLight, DirectionalLight } from 'three';
import { Object3DComponent } from './object-3d.component';
import { Object3DParent, Object3DService } from '@daxur-studios/engine';

@Component({
  selector: 'ambient-light',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [Object3DService],
})
export class AmbientLightComponent extends Object3DComponent {
  readonly color = input<string>('#ffffff');
  readonly intensity = input<number>(1);

  override readonly object3D = signal(new AmbientLight());
  get light() {
    return this.object3D;
  }

  constructor() {
    super();

    effect(() => {
      this.light().color.set(this.color());
    });

    effect(() => {
      this.light().intensity = this.intensity();
    });
  }
}

@Component({
  selector: 'directional-light',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [Object3DService],
})
export class DirectionalLightComponent extends Object3DComponent {
  readonly color = input<string>('#ffffff');
  readonly intensity = input<number>(1);

  override readonly object3D = signal(new DirectionalLight());
  get light() {
    return this.object3D;
  }

  constructor() {
    super();

    effect(() => {
      this.light().color.set(this.color());
    });

    effect(() => {
      this.light().intensity = this.intensity();
    });
  }
}
