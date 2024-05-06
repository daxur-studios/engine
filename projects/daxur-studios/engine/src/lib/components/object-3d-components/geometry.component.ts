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
  BoxGeometry,
  BufferGeometry,
  PlaneGeometry,
  SphereGeometry,
} from 'three';

import { MeshComponent } from './mesh.component';

export function provideBufferGeometryComponent(component: any): Provider {
  return {
    provide: BufferGeometryComponent,
    useExisting: component,
  };
}

@Component({
  selector: 'buffer-geometry',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [],
})
export class BufferGeometryComponent implements OnDestroy {
  readonly params = input<any>();

  readonly geometry: WritableSignal<BufferGeometry> = signal(
    new BufferGeometry()
  );
  previousGeometry: BufferGeometry | undefined;

  emoji = '🌐';

  constructor() {
    effect(
      () => {
        if (this.params()) this.updateParameters(this.params());
      },
      { allowSignalWrites: true }
    );
  }

  createGeometry(parameters: any): BufferGeometry {
    return new BufferGeometry();
  }

  private updateParameters(parameters: any) {
    if (this.previousGeometry) {
      this.previousGeometry.dispose();
    }

    const geometry = this.createGeometry(parameters);
    this.geometry.set(geometry);

    this.previousGeometry = geometry;
  }

  ngOnDestroy(): void {
    this.geometry()?.dispose();
  }
}

type BoxGeometryParameters = ConstructorParameters<typeof BoxGeometry>;

@Component({
  selector: 'box-geometry',
  template: `<ng-content></ng-content>`,
  providers: [provideBufferGeometryComponent(BoxGeometryComponent)],
  standalone: true,
})
export class BoxGeometryComponent
  extends BufferGeometryComponent
  implements OnDestroy
{
  override readonly params = input<BoxGeometryParameters>([1, 1]);

  override readonly geometry = signal(new BoxGeometry());
  override previousGeometry: BoxGeometry | undefined = this.geometry();

  constructor() {
    super();
  }

  override createGeometry(parameters: BoxGeometryParameters): BoxGeometry {
    return new BoxGeometry(...parameters);
  }
}

type SphereGeometryParameters =
  (typeof SphereGeometry)['prototype']['parameters'];

@Component({
  selector: 'sphere-geometry',
  template: `<ng-content></ng-content>`,
  standalone: true,
  imports: [],
  providers: [provideBufferGeometryComponent(SphereGeometryComponent)],
})
export class SphereGeometryComponent
  extends BufferGeometryComponent
  implements OnDestroy
{
  override readonly params = input<Partial<SphereGeometryParameters>>();

  override readonly geometry = signal(new SphereGeometry());
  override previousGeometry: SphereGeometry | undefined = this.geometry();

  constructor() {
    super();
  }

  override createGeometry(
    parameters: SphereGeometryParameters
  ): SphereGeometry {
    return new SphereGeometry(
      parameters.radius,
      parameters.widthSegments,
      parameters.heightSegments,
      parameters.phiStart,
      parameters.phiLength,
      parameters.thetaStart,
      parameters.thetaLength
    );
  }
}

type PlaneGeometryParameters = ConstructorParameters<typeof PlaneGeometry>;
@Component({
  selector: 'plane-geometry',
  template: `<ng-content></ng-content>`,
  standalone: true,
  imports: [],
  providers: [provideBufferGeometryComponent(PlaneGeometryComponent)],
})
export class PlaneGeometryComponent
  extends BufferGeometryComponent
  implements OnDestroy
{
  override readonly params = input<PlaneGeometryParameters>([1, 1]);

  override readonly geometry = signal(new PlaneGeometry());
  override previousGeometry: PlaneGeometry | undefined = this.geometry();

  constructor() {
    super();
  }

  override createGeometry(parameters: PlaneGeometryParameters): PlaneGeometry {
    return new PlaneGeometry(...parameters);
  }
}
