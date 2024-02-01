import { Component, ViewChild } from '@angular/core';
import {
  DefaultPawnComponent,
  EngineComponent,
  EngineService,
  SkyDomeComponent,
} from '@daxur-studios/engine';
import { AxesHelper } from 'three';
@Component({
  selector: 'app-engine-virtual-grid-demo',
  standalone: true,
  imports: [EngineComponent, SkyDomeComponent, DefaultPawnComponent],
  providers: [EngineService],
  templateUrl: './engine-virtual-grid-demo.component.html',
  styleUrl: './engine-virtual-grid-demo.component.scss',
})
export class EngineVirtualGridDemoComponent {
  @ViewChild(EngineComponent, { static: true }) engine?: EngineComponent;

  constructor(readonly engineService: EngineService) {}

  ngOnInit() {
    this.engineService.scene.add(new AxesHelper(5));
  }
}
