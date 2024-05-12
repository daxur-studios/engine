import { Component, computed, input } from '@angular/core';
import { provideObject3DComponent } from '../object-3d.component';
import { CloudComponent } from './cloud.component';
import { GroupComponent } from '../group.component';
import { xyz } from '../../../core';

@Component({
  selector: 'cloud-dome',
  standalone: true,
  imports: [CloudComponent],
  providers: [provideObject3DComponent(CloudDomeComponent)],
  template: `<ng-content></ng-content>
    @for (cloud of clouds(); track $index) {
    <cloud [position]="cloud" />
    } `,
})
export class CloudDomeComponent extends GroupComponent {
  override emoji = '🌥️';

  readonly numberOfClouds = input.required<number>();

  readonly clouds = computed(() => {
    return Array.from({ length: this.numberOfClouds() }).map(() =>
      randomPointAtRadius(10)
    );
  });

  constructor() {
    super();
  }
}

function randomPointAtRadius(radius: number): xyz {
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return [x, 0, z];
}
