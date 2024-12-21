import { Component, signal, WritableSignal } from '@angular/core';
import { Object3DComponent, provideObject3DComponent } from '../../object-3d';
import { Object3D, Object3DEventMap } from 'three';

@Component({
  selector: 'app-web-gpu-renderer',
  standalone: true,
  imports: [],
  templateUrl: './web-gpu-renderer.component.html',
  styleUrl: './web-gpu-renderer.component.scss',
  providers: [provideObject3DComponent(WebGpuRendererComponent)],
})
export class WebGpuRendererComponent extends Object3DComponent {
  readonly scene = this.engineService.scene;
  override object3D = signal(this.scene);
}
