import {
  Component,
  InjectionToken,
  Optional,
  SkipSelf,
  effect,
  input,
  signal,
} from '@angular/core';
import { BoxGeometry, SphereGeometry } from 'three';
import { MeshComponent } from './object-3d.component';
import { Object3DParent, provideObject3DParent } from '@daxur-studios/engine';

type BoxGeometryParameters = ConstructorParameters<typeof BoxGeometry>;

@Component({
  selector: 'box-geometry',
  template: `<ng-content></ng-content>`,
  styles: ``,
  standalone: true,
  imports: [],
  providers: [provideObject3DParent(BoxGeometryComponent)],
})
export class BoxGeometryComponent {
  readonly params = input<BoxGeometryParameters>([1, 1]);

  readonly geometry = signal(new BoxGeometry());
  private previousGeometry: BoxGeometry | undefined = this.geometry();

  readonly meshComponent: MeshComponent;

  constructor(@SkipSelf() public parent: Object3DParent) {
    this.meshComponent = parent as MeshComponent;

    effect(
      () => {
        this.updateParameters(this.params());
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        this.meshComponent.geometry.set(this.geometry());
      },
      { allowSignalWrites: true }
    );
  }

  private updateParameters(parameters: BoxGeometryParameters) {
    if (this.previousGeometry) {
      this.previousGeometry.dispose();
    }

    const geometry = new BoxGeometry(...parameters);
    this.geometry.set(geometry);

    this.previousGeometry = geometry;
  }
}

@Component({
  selector: 'sphere-geometry',
  template: `<ng-content></ng-content>`,
  styles: ``,
  standalone: true,
  imports: [],
  providers: [provideObject3DParent(SphereGeometryComponent)],
})
export class SphereGeometryComponent {
  readonly params = input<ConstructorParameters<typeof SphereGeometry>>([]);

  geometry = new SphereGeometry();

  readonly meshComponent: MeshComponent;

  constructor(@SkipSelf() public parent: Object3DParent) {
    this.meshComponent = parent as MeshComponent;

    if (this.meshComponent) {
      this.meshComponent.geometry.set(this.geometry);
    }

    effect(
      () => {
        this.updateParameters(this.params());
      },
      { allowSignalWrites: true }
    );
  }

  private updateParameters(
    parameters: ConstructorParameters<typeof SphereGeometry>
  ) {
    if (this.geometry) {
      this.geometry.dispose();
    }
    this.geometry = new SphereGeometry(...parameters);
    if (this.meshComponent) {
      this.meshComponent.geometry.set(this.geometry);
    }
  }
}
