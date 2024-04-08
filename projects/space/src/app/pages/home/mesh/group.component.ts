import { Component, signal } from '@angular/core';
import { Object3DService } from '@daxur-studios/engine';
import { Group } from 'three';
import { Object3DComponent } from './object-3d.component';

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
