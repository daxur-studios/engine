import { GridHelper } from 'three';
import { Object3DComponent } from './object-3d.component';
import {
  Component,
  Optional,
  SkipSelf,
  effect,
  input,
  signal,
} from '@angular/core';
import { Object3DParent, provideObject3DParent } from '@daxur-studios/engine';

@Component({
  selector: 'grid-helper',
  template: `<ng-content></ng-content> `,
  styles: ``,
  standalone: true,
  imports: [],
  providers: [provideObject3DParent(GridHelperComponent)],
})
export class GridHelperComponent extends Object3DComponent {
  readonly size = input.required<number>();
  readonly divisions = input.required<number>();

  readonly color1 = input<string>('rgb(99, 99, 990)');
  readonly color2 = input<string>('rgb(0, 99, 99)');

  override object3D = signal(new GridHelper());
  get grid() {
    return this.object3D;
  }

  private previousGrid: GridHelper | undefined = this.grid();

  constructor(@SkipSelf() public override parent: Object3DParent) {
    super(parent);

    effect(
      () => {
        const prevGrid = this.previousGrid;
        if (prevGrid) {
          prevGrid.removeFromParent();
          prevGrid.dispose();
        }

        const size = this.size();
        const divisions = this.divisions();

        const grid = new GridHelper(
          size,
          divisions,
          this.color1(),
          this.color2()
        );

        this.object3D.set(grid);

        // this.object3D.position.set(...position);

        this.previousGrid = grid;
      },
      { allowSignalWrites: true }
    );
  }
}
