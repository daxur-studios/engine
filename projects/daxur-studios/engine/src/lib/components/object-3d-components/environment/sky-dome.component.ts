import { Component, forwardRef, input } from '@angular/core';
import { MeshComponent } from '../mesh.component';

import {
  Object3DComponent,
  provideObject3DComponent,
} from '../object-3d.component';
import { BackSide, Color, ShaderMaterial } from 'three';
import { ShaderMaterialComponent } from '../material.component';
import { SphereGeometryComponent } from '../geometry.component';

@Component({
  selector: 'sky-dome',
  standalone: true,
  imports: [ShaderMaterialComponent, SphereGeometryComponent],
  providers: [provideObject3DComponent(SkyDomeComponent)],
  template: `<shader-material [params]="params" />
    <sphere-geometry [params]="{ radius: radius() }" />
    <ng-content></ng-content>`,
})
export class SkyDomeComponent extends MeshComponent {
  override emoji = '🌥️';

  readonly radius = input<number>(100);

  readonly params = {
    uniforms: {
      topColor: { value: new Color(0x0077ff) },
      bottomColor: { value: new Color(0xffffff) },
      offset: { value: 89 },
      exponent: { value: 0.6 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize( vWorldPosition + offset ).y;
        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
      }
    `,
    side: BackSide,
  };
}
