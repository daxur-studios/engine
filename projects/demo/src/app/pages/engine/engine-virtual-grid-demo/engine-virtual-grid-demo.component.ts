import { Component, ViewChild } from '@angular/core';
import {
  DefaultPawnComponent,
  EngineComponent,
  EngineController,
  SkyDomeComponent,
} from '@daxur-studios/engine';
import { AxesHelper } from 'three';
@Component({
  selector: 'app-engine-virtual-grid-demo',
  standalone: true,
  imports: [EngineComponent, SkyDomeComponent, DefaultPawnComponent],
  templateUrl: './engine-virtual-grid-demo.component.html',
  styleUrl: './engine-virtual-grid-demo.component.scss',
})
export class EngineVirtualGridDemoComponent {
  public readonly controller = new EngineController({ showFPS: true });

  constructor() {}

  ngOnInit() {
    this.controller.scene.add(new AxesHelper(5));
  }
}
