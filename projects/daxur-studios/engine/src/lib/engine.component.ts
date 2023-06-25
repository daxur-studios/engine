import { Component } from '@angular/core';
import { SceneComponent } from './scene/scene.component';

@Component({
  selector: 'daxur-engine',
  template: ` <p>engine works! 🔥</p>
    <daxur-scene class="flex-page"></daxur-scene>`,
  styles: [],
  standalone: true,
  imports: [SceneComponent],
  host: {
    class: 'flex-page',
  },
})
export class EngineComponent {}
