import { Component, computed, input } from '@angular/core';
import { provideObject3DComponent } from '../object-3d.component';
import { CloudComponent } from './cloud.component';
import { GroupComponent } from '../group.component';

@Component({
  selector: 'cloud-dome',
  standalone: true,
  imports: [CloudComponent],
  providers: [provideObject3DComponent(CloudDomeComponent)],
  template: `<ng-content></ng-content>
    @for (cloud of helper(); track $index) {
    <cloud [position]="[$index, $index, $index]" />
    } `,
})
export class CloudDomeComponent extends GroupComponent {
  public override emoji = '🌥️';

  readonly numberOfClouds = input.required<number>();

  readonly helper = computed(() => {
    return Array.from({ length: this.numberOfClouds() });
  });

  constructor() {
    super();
  }
}
