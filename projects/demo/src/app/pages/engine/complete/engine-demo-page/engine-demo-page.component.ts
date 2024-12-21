import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { EngineModule, EngineService } from '@daxur-studios/engine';
import { takeUntil } from 'rxjs';
import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  SphereGeometry,
  Vector3,
} from 'three';

@Component({
  selector: 'app-engine-demo-page',
  standalone: true,
  imports: [EngineModule],
  templateUrl: './engine-demo-page.component.html',
  styleUrl: './engine-demo-page.component.scss',
  providers: [
    EngineService,
    EngineService.provideEngineOptions({ showFPS: true }),
  ],
})
export class EngineDemoPageComponent {
  readonly engineService = inject(EngineService);
  ngOnInit() {
    const controller = this.engineService;
    if (!controller) return;

    const axes = new AxesHelper(5);
    axes.position.set(-0.5, -0.5, -0.5);
    axes.rotation.set(0, 1, 0);
    controller.scene.add(axes);
  }
}
