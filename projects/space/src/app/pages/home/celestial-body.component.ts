import { Component } from '@angular/core';
import { Object3DService } from '@daxur-studios/engine';
import { GroupComponent } from './mesh/group.component';
import { MeshComponent } from './mesh/mesh.component';

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
