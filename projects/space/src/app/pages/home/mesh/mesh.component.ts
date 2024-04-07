import { AfterContentInit, Component, SkipSelf, signal } from '@angular/core';
import { Object3DService } from '@daxur-studios/engine';
import { Group } from 'three';
import { MeshComponent, Object3DComponent } from './object-3d.component';

@Component({
  selector: 'group',
  template: `<ng-content></ng-content> `,

  standalone: true,
  imports: [],
  providers: [Object3DService],
})
export class GroupComponent extends Object3DComponent {
  override readonly object3D = signal(new Group());

  constructor() {
    super();
  }
}

@Component({
  selector: 'celestial-body',
  template: ` <ng-content></ng-content> `,

  standalone: true,
  imports: [GroupComponent, MeshComponent],
  providers: [Object3DService],
})
export class CelestialBodyComponent extends MeshComponent {
  constructor() {
    super();
  }
}
