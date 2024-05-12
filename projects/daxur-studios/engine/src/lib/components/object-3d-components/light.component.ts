import {
  Component,
  Injector,
  Optional,
  SkipSelf,
  effect,
  input,
  signal,
} from '@angular/core';
import { AmbientLight, DirectionalLight, PointLight } from 'three';
import {
  Object3DComponent,
  provideObject3DComponent,
} from './object-3d.component';

@Component({
  selector: 'ambient-light',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [provideObject3DComponent(AmbientLightComponent)],
})
export class AmbientLightComponent extends Object3DComponent {
  public override emoji = '💡';

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
  providers: [provideObject3DComponent(DirectionalLightComponent)],
})
export class DirectionalLightComponent extends Object3DComponent {
  public override emoji = '💡';

  readonly color = input<string>('#ffffff');
  readonly intensity = input<number>(1);

  override readonly object3D = signal(new DirectionalLight());
  get light() {
    return this.object3D;
  }

  constructor() {
    super();

    effect(() => {
      this.light().castShadow = true;
    });

    effect(() => {
      this.light().color.set(this.color());
    });

    effect(() => {
      this.light().intensity = this.intensity();
    });
  }
}

@Component({
  selector: 'point-light',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [provideObject3DComponent(PointLightComponent)],
})
export class PointLightComponent extends Object3DComponent {
  public override emoji = '💡';

  readonly color = input<string>('#ffffff');
  readonly intensity = input<number>(1);
  readonly distance = input<number>(0);
  readonly decay = input<number>(1);

  override readonly object3D = signal(new PointLight());
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

    effect(() => {
      this.light().distance = this.distance();
    });

    effect(() => {
      this.light().decay = this.decay();
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.light().dispose();
  }
}
