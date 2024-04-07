import {
  Component,
  OnDestroy,
  Optional,
  SkipSelf,
  WritableSignal,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { GroupComponent } from './mesh.component';
import { MeshComponent, Object3DComponent } from './object-3d.component';
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
  MaterialComponent,
  MeshStandardMaterialComponent,
} from './material.component';
import { BoxGeometryComponent } from './geometry.component';
import { Object3DParent, xyz, Object3DService } from '@daxur-studios/engine';

@Component({
  selector: 'line-basic-material',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class LineBasicMaterialComponent extends MaterialComponent {
  readonly params = input<LineBasicMaterialParameters>({});

  override material = signal(new LineBasicMaterial());
  previousMaterial?: LineBasicMaterial = this.material();

  constructor(public override readonly object3DService: Object3DService) {
    super(object3DService);

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
  providers: [Object3DService],
})
export class LineComponent extends Object3DComponent implements OnDestroy {
  readonly points = input<xyz[]>([]);
  readonly material = model<Material>();

  override object3D: WritableSignal<Line> = signal(new Line());
  get line() {
    return this.object3D;
  }

  readonly geometry = new BufferGeometry();

  constructor(
    public override readonly object3DService: Object3DService,
    @SkipSelf()
    public override readonly parentService: Object3DService
  ) {
    super(object3DService, parentService);

    effect(() => {
      this.updateLine(this.points(), this.material(), this.line());
    });
  }

  updateLine(points: xyz[], material: Material | undefined, line: Line) {
    const vectors = points.map((point) => new Vector3(...point));
    this.geometry.setFromPoints(vectors);

    line.geometry = this.geometry;

    if (material) {
      line.material = material;
    }
  }

  ngOnDestroy(): void {
    this.geometry.dispose();
    this.material()?.dispose();
  }
}

@Component({
  selector: 'target-visualizer',
  template: ``,
  standalone: true,
  imports: [],
  providers: [Object3DService],
})
export class TargetVisualizerComponent extends GroupComponent {
  constructor(
    public override readonly object3DService: Object3DService,
    @SkipSelf()
    public override readonly parentService: Object3DService
  ) {
    super(object3DService, parentService);
  }
}

@Component({
  selector: 'space-clock',

  standalone: true,
  imports: [
    GroupComponent,
    MeshComponent,
    MeshStandardMaterialComponent,
    BoxGeometryComponent,
    LineComponent,
    LineBasicMaterialComponent,
    TargetVisualizerComponent,
  ],
  providers: [Object3DService],
  template: `
    <line
      [points]="[
        [0, 0, 0],
        [111, 111, 111],
        [2222, 2222, 2222]
      ]"
    >
      <line-basic-material [params]="{ color: '#5de4c7', linewidth: 22 }" />
    </line>

    <line
      [points]="[
        [0, 0, 0],
        [0, 10, 0]
      ]"
      [rotation]="[0, 0, elapsedTime$.value * 0.1]"
    >
      <line-basic-material [params]="{ color: 'red' }" />
    </line>
    <line
      [points]="[
        [0, 0, 0],
        [0, 10, 0]
      ]"
      [rotation]="[0, 0, elapsedTime$.value * 00.1]"
    >
      <line-basic-material [params]="{ color: 'green' }" />
    </line>
    <line
      [points]="[
        [0, 0, 0],
        [0, 10, 0]
      ]"
      [rotation]="[0, 0, elapsedTime$.value * 000.1]"
    >
      <line-basic-material [params]="{ color: 'blue' }" />
    </line>

    <mesh>
      <mesh-standard-material [params]="{ color: '#5de4c7' }" />
      <box-geometry [params]="[1, 1, 1]" />
    </mesh>
    <ng-content></ng-content>
  `,
})
export class SpaceClockComponent extends GroupComponent {
  elapsedTime$ = this.engineService.elapsedTime$;

  constructor(
    public override readonly object3DService: Object3DService,
    @SkipSelf()
    public override readonly parentService: Object3DService
  ) {
    super(object3DService, parentService);
  }
}
