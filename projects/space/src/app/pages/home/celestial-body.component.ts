import { Component } from '@angular/core';

import {
  GroupComponent,
  MeshComponent,
  provideObject3DComponent,
} from '@daxur-studios/engine';

@Component({
  selector: 'celestial-body',
  template: ` <ng-content></ng-content> `,

  standalone: true,
  imports: [GroupComponent, MeshComponent],
  providers: [provideObject3DComponent(CelestialBodyComponent)],
})
export class CelestialBodyComponent extends MeshComponent {
  constructor() {
    super();
  }
}
