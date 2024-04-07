import {
  Component,
  InjectionToken,
  InputSignal,
  OnDestroy,
  Optional,
  SkipSelf,
  WritableSignal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  BoxGeometry,
  BufferGeometry,
  NormalBufferAttributes,
  SphereGeometry,
} from 'three';
import { MeshComponent } from './object-3d.component';
import { Object3DParent, Object3DService } from '@daxur-studios/engine';

@Component({
  selector: 'buffer-geometry',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [],
})
export abstract class BufferGeometryComponent implements OnDestroy {
  abstract readonly params: InputSignal<any>;
  abstract readonly geometry: WritableSignal<BufferGeometry>;
  abstract previousGeometry: BufferGeometry | undefined;

  public readonly object3DService: Object3DService = inject(Object3DService);

  constructor() {
    effect(
      () => {
        this.updateParameters(this.params());
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const meshComponent = this.object3DService.component() as MeshComponent;

        if (meshComponent) {
          meshComponent.geometry.set(this.geometry());
        }
      },
      { allowSignalWrites: true }
    );
  }

  abstract createGeometry(parameters: any[]): BufferGeometry;

  private updateParameters(parameters: any[]) {
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

  standalone: true,
})
export class BoxGeometryComponent
  extends BufferGeometryComponent
  implements OnDestroy
{
  readonly params = input<BoxGeometryParameters>([1, 1]);

  readonly geometry = signal(new BoxGeometry());
  override previousGeometry: BoxGeometry | undefined = this.geometry();

  constructor() {
    super();
  }

  override createGeometry(parameters: BoxGeometryParameters): BoxGeometry {
    return new BoxGeometry(...parameters);
  }
}

@Component({
  selector: 'sphere-geometry',
  template: `<ng-content></ng-content>`,

  standalone: true,
  imports: [],
  providers: [],
})
export class SphereGeometryComponent
  extends BufferGeometryComponent
  implements OnDestroy
{
  override readonly params = input<
    ConstructorParameters<typeof SphereGeometry>
  >([]);

  override geometry = signal(new SphereGeometry());
  override previousGeometry: SphereGeometry | undefined = this.geometry();

  constructor() {
    super();
  }

  override createGeometry(parameters: any[]): SphereGeometry {
    return new SphereGeometry(...parameters);
  }
}
