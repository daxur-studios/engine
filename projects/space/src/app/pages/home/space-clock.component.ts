import {
  Component,
  OnDestroy,
  Optional,
  SkipSelf,
  WritableSignal,
  contentChild,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  LineBasicMaterialParameters,
  Material,
  MeshStandardMaterial,
  Object3D,
  Object3DEventMap,
  Vector3,
} from 'three';

import {
  Object3DParent,
  xyz,
  BoxGeometryComponent,
  Css2dComponent,
  GroupComponent,
  MaterialComponent,
  MeshStandardMaterialComponent,
  provideMaterialComponent,
  Object3DComponent,
  provideObject3DComponent,
  MeshComponent,
} from '@daxur-studios/engine';

@Component({
  selector: 'line-basic-material',
  template: `<ng-content></ng-content>`,
  standalone: true,
  providers: [provideMaterialComponent(LineBasicMaterialComponent)],
})
export class LineBasicMaterialComponent extends MaterialComponent {
  readonly params = input<LineBasicMaterialParameters>({});

  override material = signal(new LineBasicMaterial());

  constructor() {
    super();

    effect(
      () => {
        this.material().setValues(this.params());
        this.material().needsUpdate = true;
      },
      { allowSignalWrites: true }
    );
  }
}

@Component({
  selector: 'line',
  template: `<ng-content></ng-content> `,
  standalone: true,
  imports: [],
  providers: [provideObject3DComponent(LineComponent)],
})
export class LineComponent extends Object3DComponent implements OnDestroy {
  readonly points = input<xyz[]>([]);
  readonly materialComponent = contentChild(MaterialComponent);

  override object3D: WritableSignal<Line> = signal(new Line());
  get line() {
    return this.object3D;
  }

  readonly geometry = new BufferGeometry();

  constructor() {
    super();

    effect(() => {
      this.updateLine(
        this.points(),
        this.materialComponent()?.material(),
        this.line()
      );
    });
  }

  updateLine(points: xyz[], material: Material | undefined, line: Line) {
    const vectors = points.map((point) => new Vector3(...point));

    this.geometry.setFromPoints(vectors);

    line.geometry = this.geometry;

    if (material) {
      line.material = material;
    }

    line.computeLineDistances();
  }

  ngOnDestroy(): void {
    this.geometry.dispose();
  }
}

@Component({
  selector: 'target-visualizer',
  template: ``,
  standalone: true,
  imports: [],
  providers: [provideObject3DComponent(TargetVisualizerComponent)],
})
export class TargetVisualizerComponent extends GroupComponent {
  constructor() {
    super();
  }
}

@Component({
  selector: 'space-clock',

  standalone: true,
  imports: [
    MeshComponent,
    MeshStandardMaterialComponent,
    BoxGeometryComponent,
    LineComponent,
    LineBasicMaterialComponent,
    TargetVisualizerComponent,
    Css2dComponent,
  ],
  providers: [provideObject3DComponent(SpaceClockComponent)],
  template: `
    <line
      [points]="[
        [0, 0, 0],
        [111, 111, 111],
        [2222, 2222, 2222],
        [3333, 3333, 3333],
        [4444, 4444, 4444],
        [5555, 5555, 5555],
        [6666, 6666, 6666],
        [7777, 7777, 7777],
        [8888, 8888, 8888],
        [9999, 9999, 9999],
        [0, 0, 0]
      ]"
    >
      <line-basic-material [params]="{ color: '#5de4c7' }" />
    </line>

    <line
      [points]="[
        [0, 0, 0],
        [0, 10, 0]
      ]"
      [rotation]="[0, 0, elapsedTime$.value * 1]"
    >
      <line-basic-material [params]="{ color: 'red' }" />
    </line>
    <line
      [points]="[
        [0, 0, 0],
        [0, 10, 0]
      ]"
      [rotation]="[0, 0, elapsedTime$.value * 0.1]"
    >
      <line-basic-material [params]="{ color: 'green' }" />
    </line>
    <line
      [points]="[
        [0, 0, 0],
        [0, 10, 0]
      ]"
      [rotation]="[0, 0, elapsedTime$.value * 0.01]"
    >
      <line-basic-material [params]="{ color: 'blue' }" />
    </line>

    <css-2d [position]="[0, 0, 0]">
      @if (distance < 100) {
      <div style="color: white; background: rgb(3, 6, 86)">
        Elapsed Time: {{ elapsedTime$.value.toFixed(2) }}s
      </div>
      }
    </css-2d>

    <mesh>
      <mesh-standard-material [params]="{ color: '#5de4c7' }" />
      <box-geometry [params]="[1, 1, 1]" />
    </mesh>
    <ng-content></ng-content>
  `,
})
export class SpaceClockComponent extends GroupComponent {
  elapsedTime$ = this.engineService.elapsedTime$;

  cameraPosition = this.engineService.camera.position;

  get distance() {
    return this.cameraPosition.distanceTo(new Vector3(...this.position()));
  }

  constructor() {
    super();
  }
}
